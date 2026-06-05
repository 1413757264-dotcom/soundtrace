"""Repository layer — async CRUD for all 12 tables"""

from typing import Optional, List
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.models import (
    Artist, Song, Credit, Sample, Collaboration,
    AudioFingerprint, User, UserSavedSample,
    UserViewHistory, UserFollow, AnalysisJob,
    SampleType, CreditRole, Genre,
)

# ═══════════════════════════════════════════════════════
# ARTIST
# ═══════════════════════════════════════════════════════

async def artist_get_by_id(db: AsyncSession, artist_id: str) -> Optional[Artist]:
    result = await db.execute(select(Artist).where(Artist.id == artist_id))
    return result.scalar_one_or_none()

async def artist_get_by_spotify_id(db: AsyncSession, spotify_id: str) -> Optional[Artist]:
    result = await db.execute(select(Artist).where(Artist.spotify_id == spotify_id))
    return result.scalar_one_or_none()

async def artist_search(db: AsyncSession, query: str, limit: int = 20) -> List[Artist]:
    result = await db.execute(
        select(Artist).where(Artist.name.ilike(f"%{query}%")).limit(limit)
    )
    return list(result.scalars().all())

async def artist_create_or_update(db: AsyncSession, data: dict) -> Artist:
    existing = None
    if data.get("spotify_id"):
        existing = await artist_get_by_spotify_id(db, data["spotify_id"])
    if not existing and data.get("musicbrainz_id"):
        result = await db.execute(select(Artist).where(Artist.musicbrainz_id == data["musicbrainz_id"]))
        existing = result.scalar_one_or_none()

    if existing:
        for k, v in data.items():
            if hasattr(existing, k) and v is not None:
                setattr(existing, k, v)
    else:
        existing = Artist(**data)
        db.add(existing)

    await db.flush()
    return existing

async def artist_get_discography(db: AsyncSession, artist_id: str) -> List[Song]:
    result = await db.execute(
        select(Song)
        .where(
            or_(
                Song.primary_artist_id == artist_id,
                Song.id.in_(
                    select(Credit.song_id).where(Credit.artist_id == artist_id)
                ),
            )
        )
        .order_by(desc(Song.release_year))
    )
    return list(result.scalars().all())

async def artist_get_top_sampled(db: AsyncSession, limit: int = 20) -> List[dict]:
    """Most sampled artists — count samples referencing their songs"""
    result = await db.execute(
        select(
            Artist.id, Artist.name,
            func.count(Sample.id).label("sample_count"),
        )
        .join(Song, Song.primary_artist_id == Artist.id)
        .join(Sample, Sample.source_song_id == Song.id)
        .group_by(Artist.id, Artist.name)
        .order_by(desc("sample_count"))
        .limit(limit)
    )
    return [{"artist_id": r[0], "name": r[1], "times_sampled": r[2]} for r in result.all()]


# ═══════════════════════════════════════════════════════
# SONG
# ═══════════════════════════════════════════════════════

async def song_get_by_id(db: AsyncSession, song_id: str) -> Optional[Song]:
    result = await db.execute(select(Song).where(Song.id == song_id))
    return result.scalar_one_or_none()

async def song_get_by_spotify_id(db: AsyncSession, spotify_id: str) -> Optional[Song]:
    result = await db.execute(select(Song).where(Song.spotify_id == spotify_id))
    return result.scalar_one_or_none()

async def song_search(
    db: AsyncSession,
    query: str = "",
    genre: Optional[Genre] = None,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    bpm_min: Optional[int] = None,
    bpm_max: Optional[int] = None,
    limit: int = 20,
    offset: int = 0,
) -> List[Song]:
    stmt = select(Song)
    conditions = []

    if query:
        conditions.append(
            or_(
                Song.title.ilike(f"%{query}%"),
                Song.primary_artist_id.in_(
                    select(Artist.id).where(Artist.name.ilike(f"%{query}%"))
                ),
            )
        )
    if genre:
        conditions.append(Song.genre == genre)
    if year_min:
        conditions.append(Song.release_year >= year_min)
    if year_max:
        conditions.append(Song.release_year <= year_max)
    if bpm_min:
        conditions.append(Song.bpm >= bpm_min)
    if bpm_max:
        conditions.append(Song.bpm <= bpm_max)

    if conditions:
        stmt = stmt.where(and_(*conditions))

    stmt = stmt.order_by(desc(Song.popularity)).offset(offset).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def song_create_or_update(db: AsyncSession, data: dict) -> Song:
    existing = None
    if data.get("spotify_id"):
        existing = await song_get_by_spotify_id(db, data["spotify_id"])
    if existing:
        for k, v in data.items():
            if hasattr(existing, k) and v is not None:
                setattr(existing, k, v)
    else:
        existing = Song(**data)
        db.add(existing)
    await db.flush()
    return existing


# ═══════════════════════════════════════════════════════
# SAMPLE
# ═══════════════════════════════════════════════════════

async def sample_get_by_id(db: AsyncSession, sample_id: str) -> Optional[Sample]:
    result = await db.execute(select(Sample).where(Sample.id == sample_id))
    return result.scalar_one_or_none()

async def sample_get_by_song(db: AsyncSession, song_id: str) -> List[Sample]:
    result = await db.execute(
        select(Sample).where(Sample.target_song_id == song_id)
    )
    return list(result.scalars().all())

async def sample_get_downstream(db: AsyncSession, sample_id: str) -> List[dict]:
    """Find all samples that reference the same source song, return dicts"""
    sample = await sample_get_by_id(db, sample_id)
    if not sample:
        return []
    result = await db.execute(
        select(Sample).where(
            and_(
                Sample.source_song_id == sample.source_song_id,
                Sample.id != sample_id,
            )
        )
    )
    return [
        {"id": s.id, "type": s.type.value if s.type else None,
         "target_song_id": s.target_song_id, "confidence": s.confidence}
        for s in result.scalars().all()
    ]

async def sample_get_upstream(db: AsyncSession, target_song_id: str) -> List[Sample]:
    """All samples used in a song — what it sampled"""
    result = await db.execute(
        select(Sample).where(Sample.target_song_id == target_song_id)
    )
    return list(result.scalars().all())

async def sample_create_batch(db: AsyncSession, samples: List[dict]) -> List[Sample]:
    objs = [Sample(**s) for s in samples]
    db.add_all(objs)
    await db.flush()
    return objs

async def sample_get_most_sampled(db: AsyncSession, limit: int = 20) -> List[dict]:
    result = await db.execute(
        select(
            Sample.source_song_id,
            Sample.source_artist_id,
            func.count(Sample.id).label("usage_count"),
        )
        .group_by(Sample.source_song_id, Sample.source_artist_id)
        .order_by(desc("usage_count"))
        .limit(limit)
    )
    return [
        {"source_song_id": r[0], "source_artist_id": r[1], "times_sampled": r[2]}
        for r in result.all()
    ]


# ═══════════════════════════════════════════════════════
# CREDIT
# ═══════════════════════════════════════════════════════

async def credit_get_by_song(db: AsyncSession, song_id: str) -> List[Credit]:
    result = await db.execute(select(Credit).where(Credit.song_id == song_id))
    return list(result.scalars().all())

async def credit_get_by_artist(db: AsyncSession, artist_id: str, role: Optional[CreditRole] = None) -> List[Credit]:
    stmt = select(Credit).where(Credit.artist_id == artist_id)
    if role:
        stmt = stmt.where(Credit.role == role)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def credit_create_batch(db: AsyncSession, credits: List[dict]) -> List[Credit]:
    objs = [Credit(**c) for c in credits]
    db.add_all(objs)
    await db.flush()
    return objs


# ═══════════════════════════════════════════════════════
# COLLABORATION (Graph edges)
# ═══════════════════════════════════════════════════════

async def collab_get_network(db: AsyncSession, artist_id: str, depth: int = 2) -> dict:
    """Build collaboration network up to `depth` degrees"""
    # Direct collaborations
    direct = await db.execute(
        select(Collaboration).where(
            or_(
                Collaboration.source_artist_id == artist_id,
                Collaboration.target_artist_id == artist_id,
            )
        )
    )
    edges = list(direct.scalars().all())
    nodes_set = {artist_id}
    for e in edges:
        nodes_set.add(e.source_artist_id)
        nodes_set.add(e.target_artist_id)

    # Second degree
    if depth >= 2:
        all_artist_ids = list(nodes_set)
        second_degree = await db.execute(
            select(Collaboration).where(
                or_(
                    Collaboration.source_artist_id.in_(all_artist_ids),
                    Collaboration.target_artist_id.in_(all_artist_ids),
                )
            )
        )
        for e in second_degree.scalars().all():
            edges.append(e)
            nodes_set.add(e.source_artist_id)
            nodes_set.add(e.target_artist_id)

    return {
        "nodes": [{"id": nid} for nid in nodes_set],
        "edges": [
            {
                "source": e.source_artist_id,
                "target": e.target_artist_id,
                "type": e.relationship_type.value,
                "weight": e.weight,
            }
            for e in edges
        ],
    }


# ═══════════════════════════════════════════════════════
# AUDIO FINGERPRINTS
# ═══════════════════════════════════════════════════════

async def fingerprint_create(db: AsyncSession, data: dict) -> AudioFingerprint:
    fp = AudioFingerprint(**data)
    db.add(fp)
    await db.flush()
    return fp

async def fingerprint_search(db: AsyncSession, fingerprint_hash: str) -> List[AudioFingerprint]:
    """Search by fingerprint — exact or near-match"""
    result = await db.execute(
        select(AudioFingerprint)
        .where(AudioFingerprint.fingerprint.contains(fingerprint_hash[:100]))
        .limit(10)
    )
    return list(result.scalars().all())


# ═══════════════════════════════════════════════════════
# USER
# ═══════════════════════════════════════════════════════

async def user_get_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def user_get_by_username(db: AsyncSession, username: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def user_get_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def user_create(db: AsyncSession, data: dict) -> User:
    user = User(**data)
    db.add(user)
    await db.flush()
    return user


# ═══════════════════════════════════════════════════════
# SAVED SAMPLES
# ═══════════════════════════════════════════════════════

async def saved_get_by_user(db: AsyncSession, user_id: str, limit: int = 50) -> List[UserSavedSample]:
    result = await db.execute(
        select(UserSavedSample)
        .where(UserSavedSample.user_id == user_id)
        .order_by(desc(UserSavedSample.created_at))
        .limit(limit)
    )
    return list(result.scalars().all())

async def saved_toggle(db: AsyncSession, user_id: str, sample_id: str) -> bool:
    result = await db.execute(
        select(UserSavedSample).where(
            and_(
                UserSavedSample.user_id == user_id,
                UserSavedSample.sample_id == sample_id,
            )
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.flush()
        return False  # now unsaved
    db.add(UserSavedSample(user_id=user_id, sample_id=sample_id))
    await db.flush()
    return True  # now saved


# ═══════════════════════════════════════════════════════
# VIEW HISTORY
# ═══════════════════════════════════════════════════════

async def history_add(db: AsyncSession, user_id: str, song_id: str) -> UserViewHistory:
    entry = UserViewHistory(user_id=user_id, song_id=song_id)
    db.add(entry)
    await db.flush()
    return entry

async def history_get_by_user(db: AsyncSession, user_id: str, limit: int = 50) -> List[UserViewHistory]:
    result = await db.execute(
        select(UserViewHistory)
        .where(UserViewHistory.user_id == user_id)
        .order_by(desc(UserViewHistory.viewed_at))
        .limit(limit)
    )
    return list(result.scalars().all())


# ═══════════════════════════════════════════════════════
# FOLLOWS
# ═══════════════════════════════════════════════════════

async def follow_toggle(db: AsyncSession, user_id: str, artist_id: str) -> bool:
    result = await db.execute(
        select(UserFollow).where(
            and_(UserFollow.user_id == user_id, UserFollow.follows_artist_id == artist_id)
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        await db.delete(existing)
        await db.flush()
        return False
    db.add(UserFollow(user_id=user_id, follows_artist_id=artist_id))
    await db.flush()
    return True

async def follow_get_artists(db: AsyncSession, user_id: str) -> List[str]:
    result = await db.execute(
        select(UserFollow.follows_artist_id).where(UserFollow.user_id == user_id)
    )
    return [r[0] for r in result.all()]


# ═══════════════════════════════════════════════════════
# ANALYSIS JOBS
# ═══════════════════════════════════════════════════════

async def job_create(db: AsyncSession, data: dict) -> AnalysisJob:
    job = AnalysisJob(**data)
    db.add(job)
    await db.flush()
    return job

async def job_get(db: AsyncSession, job_id: str) -> Optional[AnalysisJob]:
    result = await db.execute(select(AnalysisJob).where(AnalysisJob.id == job_id))
    return result.scalar_one_or_none()

async def job_update(db: AsyncSession, job_id: str, data: dict) -> Optional[AnalysisJob]:
    job = await job_get(db, job_id)
    if job:
        for k, v in data.items():
            if hasattr(job, k):
                setattr(job, k, v)
        await db.flush()
    return job
