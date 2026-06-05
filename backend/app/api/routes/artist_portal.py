"""Artist Portal API — music creator onboarding + sample annotation"""

from fastapi import APIRouter, Depends, Query, HTTPException, UploadFile, File
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.db.repository import (
    user_get_by_id, artist_create_or_update, song_create_or_update,
    sample_create_batch, credit_create_batch,
)
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/api/v1/artist", tags=["artist_portal"])


@router.post("/apply")
async def apply_as_artist(
    artist_name: str = Query(...),
    bio: Optional[str] = Query(None),
    genres: str = Query("hip_hop"),  # comma-separated
    social_links: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Music creator application.
    Upgrades user account to artist, creates artist profile.
    """
    user = await user_get_by_id(db, current_user["id"])
    if not user:
        raise HTTPException(404, "User not found")

    # Create artist profile
    artist = await artist_create_or_update(db, {
        "name": artist_name,
        "bio": bio,
        "genres": [g.strip() for g in genres.split(",")],
        "type": "primary",
    })

    # Upgrade user
    user.is_artist = True
    user.display_name = artist_name

    return {
        "success": True,
        "data": {
            "artist_id": artist.id,
            "artist_name": artist.name,
            "message": "音乐人入驻申请已提交",
        },
    }


@router.post("/upload-song")
async def upload_song(
    title: str = Query(...),
    release_year: Optional[int] = Query(None),
    bpm: Optional[int] = Query(None),
    key_signature: Optional[str] = Query(None),
    sub_genre: Optional[str] = Query(None),
    file: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload an original song.
    Artist can self-annotate sample sources.
    """
    user = await user_get_by_id(db, current_user["id"])
    if not user or not user.is_artist:
        raise HTTPException(403, "Only verified artists can upload songs")

    # Find the artist profile
    from app.db.repository import artist_get_by_id
    artist = None
    # Try to find artist by name matching display_name
    from sqlalchemy import select
    from app.models.models import Artist
    result = await db.execute(
        select(Artist).where(Artist.name == user.display_name)
    )
    artist = result.scalar_one_or_none()

    song_data = {
        "title": title,
        "primary_artist_id": artist.id if artist else None,
        "release_year": release_year or 2025,
        "bpm": bpm,
        "key_signature": key_signature,
        "sub_genre": sub_genre,
    }
    song = await song_create_or_update(db, song_data)

    return {
        "success": True,
        "data": {
            "song_id": song.id,
            "title": song.title,
            "message": "歌曲上传成功",
        },
    }


@router.post("/annotate-samples")
async def annotate_samples(
    song_id: str = Query(...),
    samples: str = Query(...),  # JSON: [{"source_title":"...","source_artist":"...","type":"drum","start_ms":0,"end_ms":1000}]
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Self-annotate sample sources used in your song.
    Artist-submitted annotations are reviewed before being confirmed.
    """
    import json
    user = await user_get_by_id(db, current_user["id"])
    if not user or not user.is_artist:
        raise HTTPException(403, "Only verified artists can annotate samples")

    try:
        sample_list = json.loads(samples)
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON format for samples")

    created = []
    for s in sample_list:
        # Find or create source artist
        from app.db.repository import artist_search
        source_artists = await artist_search(db, s["source_artist"])
        if source_artists:
            source_artist_id = source_artists[0].id
        else:
            source_artist = await artist_create_or_update(db, {
                "name": s["source_artist"],
                "type": "primary",
            })
            source_artist_id = source_artist.id

        # Find or create source song
        from sqlalchemy import select
        from app.models.models import Song
        result = await db.execute(
            select(Song).where(
                Song.title.ilike(f"%{s['source_title']}%"),
                Song.primary_artist_id == source_artist_id,
            )
        )
        source_song = result.scalar_one_or_none()
        if not source_song:
            source_song = await song_create_or_update(db, {
                "title": s["source_title"],
                "primary_artist_id": source_artist_id,
                "release_year": s.get("source_year"),
            })

        # Create sample relationship (pending review)
        sample_obj = {
            "type": s.get("type", "melody"),
            "source_song_id": source_song.id,
            "source_artist_id": source_artist_id,
            "target_song_id": song_id,
            "start_time_ms": s.get("start_ms", 0),
            "end_time_ms": s.get("end_ms", 0),
            "target_start_time_ms": s.get("target_start_ms", 0),
            "target_end_time_ms": s.get("target_end_ms", 0),
            "description": s.get("description", "Artist self-annotated"),
            "confidence": 0.5,
            "attribution_confirmed": False,  # Pending review
        }
        created.append(sample_obj)

    if created:
        samples = await sample_create_batch(db, created)

    return {
        "success": True,
        "data": {
            "annotated_count": len(created),
            "status": "pending_review",
            "message": "采样标注已提交审核，通过后将公开显示",
        },
    }


@router.get("/{artist_id}/stats")
async def artist_stats(
    artist_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get artist statistics: songs, samples, credits, profile views"""
    from app.db.repository import artist_get_discography
    songs = await artist_get_discography(db, artist_id)
    return {
        "success": True,
        "data": {
            "artist_id": artist_id,
            "total_songs": len(songs),
            "total_samples_used": 0,  # TODO
            "total_times_sampled": 0,  # TODO
        },
    }
