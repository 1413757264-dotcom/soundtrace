"""Search API — Kanye West exclusive: search local database only"""
from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from app.core.database import get_db
from app.models.models import Song, Artist, Sample, Credit
from app.db.repository import song_get_by_id, artist_get_by_id, sample_get_by_song, credit_get_by_song

router = APIRouter(prefix="/api/v1/search", tags=["search"])

KANYE_ID = "a01"


@router.get("")
async def search(
    q: str = Query("", min_length=0),
    page: int = Query(1, ge=1),
    limit: int = Query(200, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Search Kanye West songs only — local database"""
    stmt = select(Song).where(Song.primary_artist_id == KANYE_ID)

    if q.strip():
        stmt = stmt.where(
            or_(
                Song.title.ilike(f"%{q}%"),
                Song.album_title.ilike(f"%{q}%"),
            )
        )

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    # Paginate
    offset = (page - 1) * limit
    result = await db.execute(
        stmt.order_by(Song.release_year.desc(), Song.album_title).offset(offset).limit(limit)
    )
    songs = result.scalars().all()

    data = []
    for s in songs:
        samples = await sample_get_by_song(db, s.id)
        credits = await credit_get_by_song(db, s.id)
        data.append({
            "id": s.id,
            "title": s.title,
            "primary_artist_name": "Kanye West",
            "primary_artist_id": KANYE_ID,
            "album_title": s.album_title or "",
            "release_year": s.release_year or 0,
            "duration_ms": s.duration_ms,
            "bpm": s.bpm or 0,
            "key_signature": s.key_signature or "",
            "sub_genre": s.sub_genre or "",
            "sample_count": len(samples),
            "credit_count": len(credits),
        })

    return {
        "success": True,
        "data": data,
        "meta": {
            "page": page, "limit": limit, "total": total,
            "source": "kanye_db", "query": q,
        },
    }


@router.get("/trending")
async def trending(db: AsyncSession = Depends(get_db)):
    """Most sampled Kanye songs"""
    result = await db.execute(
        select(Song.title, func.count(Sample.id).label("cnt"))
        .join(Sample, Sample.target_song_id == Song.id)
        .where(Song.primary_artist_id == KANYE_ID)
        .group_by(Song.id)
        .order_by(func.count(Sample.id).desc())
        .limit(10)
    )
    return {
        "success": True,
        "data": [
            {"title": r[0], "sample_count": r[1]}
            for r in result.all()
        ],
    }


@router.get("/autocomplete")
async def autocomplete(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
):
    """Autocomplete Kanye song titles"""
    result = await db.execute(
        select(Song.title, Song.album_title, Song.release_year)
        .where(
            and_(
                Song.primary_artist_id == KANYE_ID,
                Song.title.ilike(f"%{q}%"),
            )
        )
        .order_by(Song.release_year.desc())
        .limit(8)
    )
    return {
        "success": True,
        "data": [
            {"title": r[0], "album": r[1], "year": r[2]}
            for r in result.all()
        ],
    }


@router.get("/enrich")
async def enrich_song_endpoint(
    song_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Get full song detail: description + samples + credits + album intro"""
    from app.data.kanye_content import SONG_DESCRIPTIONS, ALBUM_INTROS

    song = await song_get_by_id(db, song_id)
    if not song:
        return {"success": False, "error": {"code": "NOT_FOUND", "message": "Song not found"}}

    samples = await sample_get_by_song(db, song_id)
    credits = await credit_get_by_song(db, song_id)

    sample_data = []
    for sp in samples:
        src_song = await song_get_by_id(db, sp.source_song_id) if sp.source_song_id else None
        src_artist = await artist_get_by_id(db, sp.source_artist_id) if sp.source_artist_id else None
        sample_data.append({
            "id": sp.id,
            "type": sp.type.value if sp.type else "melody",
            "source_title": src_song.title if src_song else "",
            "source_artist": src_artist.name if src_artist else "",
            "source_year": src_song.release_year if src_song else None,
            "start_time_ms": sp.start_time_ms,
            "end_time_ms": sp.end_time_ms,
            "confidence": sp.confidence,
            "description": sp.description,
        })

    credit_data = []
    for cr in credits:
        art = await artist_get_by_id(db, cr.artist_id) if cr.artist_id else None
        credit_data.append({
            "artist_name": art.name if art else "",
            "artist_id": cr.artist_id,
            "role": cr.role.value if cr.role else "",
        })

    # Rich content
    song_info = SONG_DESCRIPTIONS.get(song_id, {})
    album_info = ALBUM_INTROS.get(song.album_title or "", {})

    return {
        "success": True,
        "data": {
            "id": song.id,
            "title": song.title,
            "primary_artist": "Kanye West",
            "album": song.album_title,
            "year": song.release_year,
            "duration_ms": song.duration_ms,
            "bpm": song.bpm,
            "key": song.key_signature,
            "sub_genre": song.sub_genre,
            "samples": sample_data,
            "credits": credit_data,
            # Rich descriptions
            "theme": song_info.get("theme", ""),
            "context": song_info.get("context", ""),
            "album_intro": {
                "era": album_info.get("era", ""),
                "bio": album_info.get("bio", ""),
                "theme": album_info.get("theme", ""),
                "sound": album_info.get("sound", ""),
                "legacy": album_info.get("legacy", ""),
            } if album_info else None,
        },
    }
