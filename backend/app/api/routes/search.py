"""Search API — iTunes search + artist lookup for full discography"""

from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.spotify import search_tracks as spotify_search, get_audio_features, spotify_track_to_song_dict
from app.services.itunes import search_tracks as itunes_search, itunes_track_to_dict, lookup_artist as itunes_lookup_artist
from app.services.recommendations import generate_discover_playlist
from app.db.repository import song_search as db_search
from app.core.cache import cache_get, cache_set
import json

router = APIRouter(prefix="/api/v1/search", tags=["search"])


@router.get("")
async def search(
    q: str = Query("", min_length=0),
    type: str = Query("track"),
    artist: str = Query("", description="Filter by artist name"),
    page: int = Query(1, ge=1),
    limit: int = Query(200, le=200),
    source: str = Query("all"),
    db: AsyncSession = Depends(get_db),
):
    """Hybrid search: iTunes API + local PostgreSQL"""
    results = []
    total = 0

    # Cache
    cache_key = f"search:{q}:{artist}:{page}:{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    # ── iTunes ──
    if source in ("itunes", "all"):
        try:
            offset = (page - 1) * limit
            itunes_results = await itunes_search(q, limit=limit, offset=offset, artist=artist)
            for track in itunes_results.get("results", []):
                results.append(itunes_track_to_dict(track))
            total = itunes_results.get("resultCount", len(results))
        except Exception:
            pass

    # ── Local DB ──
    if source in ("local", "all") and len(results) < limit:
        local_songs = await db_search(db, query=q, limit=limit - len(results), offset=(page-1)*limit)
        for s in local_songs:
            results.append({
                "title": s.title, "spotify_id": s.spotify_id,
                "primary_artist_name": s.primary_artist_obj.name if hasattr(s, 'primary_artist_obj') and s.primary_artist_obj else "",
                "release_year": s.release_year, "duration_ms": s.duration_ms,
                "bpm": s.bpm, "key_signature": s.key_signature,
                "sub_genre": s.sub_genre.value if s.sub_genre else None,
            })

    response = {
        "success": True, "data": results,
        "meta": {"page": page, "limit": limit, "total": total or len(results), "source": source, "query": q},
    }
    await cache_set(cache_key, json.dumps(response), ttl=300)
    return response


@router.get("/artist-lookup/{artist_id}")
async def artist_lookup(
    artist_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get an artist's FULL discography via iTunes Lookup API.
    Returns ALL albums + tracks, grouped by album, sorted by year.
    This gives the complete catalog, not just search results.
    """
    from app.services.itunes import lookup_artist as itunes_lookup

    cache_key = f"artist_lookup:{artist_id}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    data = await itunes_lookup(artist_id)
    if not data:
        return {"success": False, "error": {"code": "NOT_FOUND", "message": "Artist not found"}}

    results = data.get("results", [])
    artist_info = results[0] if results else {}
    songs = []
    albums: dict[str, dict] = {}

    for r in results[1:]:
        if r.get("wrapperType") == "track":
            track = itunes_track_to_dict(r)
            songs.append(track)

            # Group by album
            album_name = r.get("collectionName", "未知专辑")
            if album_name not in albums:
                albums[album_name] = {
                    "name": album_name,
                    "year": int(r["releaseDate"][:4]) if r.get("releaseDate") else None,
                    "artwork": r.get("artworkUrl100", "").replace("100x100", "600x600"),
                    "track_count": r.get("trackCount", 0),
                    "songs": [],
                }
            albums[album_name]["songs"].append(track)

    # Sort albums by year desc
    album_list = sorted(albums.values(), key=lambda a: a["year"] or 0, reverse=True)

    response = {
        "success": True,
        "data": {
            "artist": {
                "name": artist_info.get("artistName", ""),
                "genre": artist_info.get("primaryGenreName", ""),
                "itunes_id": str(artist_info.get("artistId", "")),
            },
            "total_songs": len(songs),
            "total_albums": len(album_list),
            "albums": album_list,
            "songs": songs,
        },
    }
    await cache_set(cache_key, json.dumps(response), ttl=86400)  # 24h cache
    return response


@router.get("/autocomplete")
async def autocomplete(q: str = Query(..., min_length=2)):
    try:
        spotify_results = await spotify_search(q, limit=5)
        suggestions = []
        for track in spotify_results.get("tracks", {}).get("items", []):
            suggestions.append({
                "title": track["name"], "artist": track["artists"][0]["name"] if track.get("artists") else "Unknown",
                "spotify_id": track["id"],
                "year": track["album"]["release_date"][:4] if track.get("album", {}).get("release_date") else None,
            })
        return {"success": True, "data": suggestions}
    except Exception:
        return {"success": True, "data": []}


@router.get("/trending")
async def trending(db: AsyncSession = Depends(get_db)):
    try:
        playlist = await generate_discover_playlist(db, limit=10)
        return {"success": True, "data": playlist}
    except Exception:
        return {"success": True, "data": ["Kendrick Lamar 新专辑采样", "BoomBap 经典采样排行"]}
