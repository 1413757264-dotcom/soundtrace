"""Sample API — full database-backed traceability"""

from fastapi import APIRouter, Query, Depends, HTTPException
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.db.repository import (
    sample_get_by_song, sample_get_downstream, sample_get_by_id,
    sample_get_most_sampled, song_get_by_id, artist_get_by_id,
    artist_get_discography, credit_get_by_song,
)
from app.services.whosampled import find_sample_matches
from app.services.recommendations import generate_discover_playlist

router = APIRouter(prefix="/api/v1/samples", tags=["samples"])


@router.get("/trace")
async def trace_samples(
    artist: str = Query(...),
    title: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Core: trace all samples used in a song (DB + WhoSampled)"""
    # Try WhoSampled first for comprehensive data
    ws_samples = await find_sample_matches(artist, title)

    # Also check local DB
    local_samples = []
    # Find the song in DB by artist+title
    from sqlalchemy import select
    from app.models.models import Song, Artist
    result = await db.execute(
        select(Song).join(Artist, Artist.id == Song.primary_artist_id)
        .where(Artist.name.ilike(f"%{artist}%"), Song.title.ilike(f"%{title}%"))
    )
    song = result.scalar_one_or_none()
    if song:
        local_samples = await sample_get_by_song(db, song.id)

    # Build sample list avoiding lazy loading
    local_sample_data = []
    for s in local_samples:
        src_song = await song_get_by_id(db, s.source_song_id) if s.source_song_id else None
        src_artist = await artist_get_by_id(db, s.source_artist_id) if s.source_artist_id else None
        local_sample_data.append({
            "title": src_song.title if src_song else "Unknown",
            "artist": src_artist.name if src_artist else "Unknown",
            "type": s.type.value if s.type else "melody",
            "confidence": s.confidence,
        })

    return {
        "success": True,
        "data": {
            "song": {"artist": artist, "title": title},
            "samples_used": ws_samples if ws_samples else local_sample_data,
            "total": max(len(ws_samples), len(local_samples)),
        },
    }


@router.get("/downstream")
async def downstream_trace(
    sample_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Get all songs that use the same sample source"""
    downstream = await sample_get_downstream(db, sample_id)
    # Enrich with song titles
    enriched = []
    for s in downstream:
        target = await song_get_by_id(db, s["target_song_id"]) if s.get("target_song_id") else None
        enriched.append({
            "id": s["id"],
            "title": target.title if target else s.get("target_song_title", ""),
            "song_id": s.get("target_song_id"),
            "type": s.get("type"),
        })
    return {
        "success": True,
        "data": enriched,
        "meta": {"total": len(enriched)},
    }


@router.get("/discover")
async def discover_samples(
    genre: Optional[str] = Query(None),
    year_min: Optional[int] = Query(None),
    year_max: Optional[int] = Query(None),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Most-sampled sources — from database"""
    try:
        playlist = await generate_discover_playlist(db, limit=limit)
        return {"success": True, "data": playlist}
    except Exception:
        return {"success": True, "data": []}


@router.get("/artist-songs")
async def artist_songs(
    artist_id: str = Query("a01", description="Artist ID"),
    db: AsyncSession = Depends(get_db),
):
    """Get all songs for an artist with sample counts and credits"""
    songs = await artist_get_discography(db, artist_id)
    artist = await artist_get_by_id(db, artist_id)

    data = []
    for song in songs:
        samples = await sample_get_by_song(db, song.id)
        credits = await credit_get_by_song(db, song.id)
        data.append({
            "id": song.id,
            "title": song.title,
            "album": song.album_title or "",
            "release_year": song.release_year or 0,
            "duration_ms": song.duration_ms,
            "bpm": song.bpm or 0,
            "key": song.key_signature or "",
            "sub_genre": song.sub_genre or "",
            "sample_count": len(samples),
            "credit_count": len(credits),
            "primary_artist": {"id": artist_id, "name": artist.name if artist else "Unknown"},
        })

    data.sort(key=lambda s: (s["album"], s["release_year"]))

    return {
        "success": True,
        "data": data,
        "meta": {
            "artist_id": artist_id,
            "artist_name": artist.name if artist else "",
            "total": len(data),
            "albums": sorted(set(s["album"] for s in data if s["album"])),
        },
    }


@router.get("/{sample_id}")
async def sample_detail(sample_id: str, db: AsyncSession = Depends(get_db)):
    """Get single sample detail"""
    sample = await sample_get_by_id(db, sample_id)
    if not sample:
        raise HTTPException(404, "Sample not found")
    # Get source song title + artist name via separate queries
    from app.db.repository import song_get_by_id, artist_get_by_id
    source_song = await song_get_by_id(db, sample.source_song_id) if sample.source_song_id else None
    source_artist = await artist_get_by_id(db, sample.source_artist_id) if sample.source_artist_id else None

    return {
        "success": True,
        "data": {
            "id": sample.id,
            "type": sample.type.value if sample.type else None,
            "source_song": source_song.title if source_song else "",
            "source_artist": source_artist.name if source_artist else "",
            "target_song_id": sample.target_song_id,
            "start_time_ms": sample.start_time_ms,
            "end_time_ms": sample.end_time_ms,
            "confidence": sample.confidence,
            "confirmed": sample.attribution_confirmed,
            "description": sample.description,
        },
    }


@router.post("/{sample_id}/save")
async def toggle_save_sample(
    sample_id: str,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Toggle save/unsave a sample for a user"""
    from app.db.repository import saved_toggle
    saved = await saved_toggle(db, user_id, sample_id)
    return {"success": True, "data": {"saved": saved}}
