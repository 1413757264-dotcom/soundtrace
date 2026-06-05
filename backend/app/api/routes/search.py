"""Search API — Spotify + local DB hybrid search"""

from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.spotify import search_tracks as spotify_search, get_audio_features, spotify_track_to_song_dict
from app.services.itunes import search_tracks as itunes_search, itunes_track_to_dict
from app.db.repository import song_search as db_search, artist_search, song_create_or_update
from app.services.recommendations import generate_discover_playlist
from app.core.cache import cache_get, cache_set
import json

router = APIRouter(prefix="/api/v1/search", tags=["search"])


@router.get("")
async def search(
    q: str = Query("", min_length=0),
    type: str = Query("track"),
    artist: str = Query("", description="Filter by artist name"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, le=200),
    source: str = Query("all"),
    genre: Optional[str] = Query(None),
    year_min: Optional[int] = Query(None),
    year_max: Optional[int] = Query(None),
    bpm_min: Optional[int] = Query(None),
    bpm_max: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Hybrid search: Spotify API + local PostgreSQL"""
    results = []
    total = 0

    # Cache check
    cache_key = f"search:{q}:{page}:{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    # ── iTunes (free, global, 80M tracks) ──
    if source in ("itunes", "all"):
        try:
            offset = (page - 1) * limit
            itunes_results = await itunes_search(q, limit=limit, offset=offset, artist=artist)
            for track in itunes_results.get("results", []):
                results.append(itunes_track_to_dict(track))
            total = itunes_results.get("resultCount", len(results))
        except Exception:
            pass

    # ── Spotify (needs premium) ──
    if source in ("spotify",) and len(results) == 0:
        try:
            offset = (page - 1) * limit
            spotify_results = await spotify_search(q, limit=limit, offset=offset)
            for track in spotify_results.get("tracks", {}).get("items", []):
                af = await get_audio_features(track["id"])
                results.append(spotify_track_to_song_dict(track, af))
            total = spotify_results.get("tracks", {}).get("total", len(results))
        except Exception:
            pass

    # ── Local DB ──
    if source in ("local", "all") and len(results) < limit:
        local_songs = await db_search(
            db, query=q, genre=genre,
            year_min=year_min, year_max=year_max,
            bpm_min=bpm_min, bpm_max=bpm_max,
            limit=limit - len(results),
            offset=(page - 1) * limit,
        )
        for s in local_songs:
            # Get artist name via separate query (avoid lazy load in async)
            artist_name = ""
            if s.primary_artist_id:
                from app.db.repository import artist_get_by_id
                artist = await artist_get_by_id(db, s.primary_artist_id)
                artist_name = artist.name if artist else ""
            results.append({
                "title": s.title,
                "spotify_id": s.spotify_id,
                "primary_artist_name": artist_name,
                "release_year": s.release_year,
                "duration_ms": s.duration_ms,
                "bpm": s.bpm,
                "key_signature": s.key_signature,
                "sub_genre": s.sub_genre.value if s.sub_genre else None,
            })

    response = {
        "success": True,
        "data": results,
        "meta": {"page": page, "limit": limit, "total": total or len(results), "source": source, "query": q},
    }
    await cache_set(cache_key, json.dumps(response), ttl=300)  # 5 min cache
    return response


@router.get("/autocomplete")
async def autocomplete(q: str = Query(..., min_length=2)):
    """Quick autocomplete — Spotify first, local fallback"""
    try:
        spotify_results = await search_tracks(q, limit=5)
        suggestions = []
        for track in spotify_results.get("tracks", {}).get("items", []):
            suggestions.append({
                "title": track["name"],
                "artist": track["artists"][0]["name"] if track.get("artists") else "Unknown",
                "spotify_id": track["id"],
                "year": track["album"]["release_date"][:4] if track.get("album", {}).get("release_date") else None,
            })
        return {"success": True, "data": suggestions}
    except Exception:
        return {"success": True, "data": []}


@router.get("/artist/{artist_id}")
async def artist_lookup(artist_id: int):
    """Get artist details + full discography from iTunes"""
    from app.services.itunes import lookup_artist
    data = await lookup_artist(artist_id)
    if not data:
        return {"success": False, "error": {"code": "NOT_FOUND", "message": "Artist not found"}}
    results = data.get("results", [])
    artist_info = results[0] if results else {}
    songs = [itunes_track_to_dict(r) for r in results[1:] if r.get("wrapperType") == "track"]
    return {
        "success": True,
        "data": {
            "artist": {
                "name": artist_info.get("artistName", ""),
                "genre": artist_info.get("primaryGenreName", ""),
                "itunes_id": str(artist_info.get("artistId", "")),
            },
            "songs": songs,
            "total": len(songs),
        },
    }


@router.get("/trending")
async def trending(db: AsyncSession = Depends(get_db)):
    """Top 10 most-sampled sources — the real trending data"""
    try:
        playlist = await generate_discover_playlist(db, limit=10)
        return {"success": True, "data": playlist}
    except Exception:
        return {
            "success": True,
            "data": ["Kendrick Lamar 新专辑采样", "BoomBap 经典采样排行", "James Brown 被采样排行"],
        }
