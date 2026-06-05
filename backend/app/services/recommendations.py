"""Recommendation engine + playlist generation + daily digest"""

from typing import List, Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Song, Sample, Artist, UserSavedSample, Credit


async def recommend_same_sample(
    db: AsyncSession, song_id: str, limit: int = 10,
) -> List[Song]:
    """Find songs that share the same sample sources"""
    # Get samples used by this song
    samples = await db.execute(
        select(Sample).where(Sample.target_song_id == song_id)
    )
    source_ids = [s.source_song_id for s in samples.scalars().all()]

    if not source_ids:
        return []

    # Find other songs using the same sources
    result = await db.execute(
        select(Song)
        .distinct()
        .join(Sample, Sample.target_song_id == Song.id)
        .where(
            Sample.source_song_id.in_(source_ids),
            Song.id != song_id,
        )
        .order_by(desc(Song.popularity))
        .limit(limit)
    )
    return list(result.scalars().all())


async def recommend_same_producer(
    db: AsyncSession, song_id: str, limit: int = 10,
) -> List[Song]:
    """Find songs by the same producer(s)"""
    credits = await db.execute(
        select(Credit).where(
            Credit.song_id == song_id,
            Credit.role.in_(["producer", "co_producer"]),
        )
    )
    producer_ids = [c.artist_id for c in credits.scalars().all()]

    if not producer_ids:
        return []

    result = await db.execute(
        select(Song)
        .distinct()
        .join(Credit, Credit.song_id == Song.id)
        .where(
            Credit.artist_id.in_(producer_ids),
            Credit.role.in_(["producer", "co_producer"]),
            Song.id != song_id,
        )
        .order_by(desc(Song.release_year))
        .limit(limit)
    )
    return list(result.scalars().all())


async def recommend_same_style(
    db: AsyncSession, song_id: str, limit: int = 10,
) -> List[Song]:
    """Find songs with similar BPM + sub-genre + key"""
    song = await db.execute(select(Song).where(Song.id == song_id))
    song = song.scalar_one_or_none()
    if not song:
        return []

    result = await db.execute(
        select(Song)
        .where(
            Song.sub_genre == song.sub_genre,
            Song.id != song_id,
            Song.bpm.between(
                (song.bpm or 90) - 10, (song.bpm or 90) + 10
            ),
        )
        .order_by(desc(Song.popularity))
        .limit(limit)
    )
    return list(result.scalars().all())


async def generate_discover_playlist(
    db: AsyncSession, genre: Optional[str] = None, era: Optional[str] = None,
    limit: int = 30,
) -> List[dict]:
    """
    Auto-generate discovery playlists:
    - "James Brown 被采样全集"
    - "2025 最佳采样 Hip-Hop"
    - "90年代BoomBap采样溯源"
    """
    stmt = select(
        Sample.source_song_id,
        Sample.source_artist_id,
        func.count(Sample.id).label("cnt"),
        Song.title,
        Artist.name,
    ).join(Song, Song.id == Sample.source_song_id)\
     .join(Artist, Artist.id == Sample.source_artist_id)\
     .group_by(
         Sample.source_song_id, Sample.source_artist_id,
         Song.title, Artist.name,
     )\
     .order_by(desc("cnt"))\
     .limit(limit)

    result = await db.execute(stmt)
    return [
        {
            "song_id": r[0],
            "artist_id": r[1],
            "times_sampled": r[2],
            "title": r[3],
            "artist": r[4],
        }
        for r in result.all()
    ]


async def daily_digest(db: AsyncSession, user_id: str) -> dict:
    """Generate a daily digest for a user based on their follows + saved samples"""
    from app.db.repository import follow_get_artists, saved_get_by_user

    followed_artists = await follow_get_artists(db, user_id)
    saved_samples = await saved_get_by_user(db, user_id, limit=20)
    saved_sample_ids = [s.sample_id for s in saved_samples]

    # New songs by followed artists
    new_from_follows = []
    if followed_artists:
        result = await db.execute(
            select(Song)
            .where(
                Song.primary_artist_id.in_(followed_artists),
            )
            .order_by(desc(Song.release_year))
            .limit(5)
        )
        new_from_follows = [
            {"title": s.title, "artist_id": s.primary_artist_id, "year": s.release_year}
            for s in result.scalars().all()
        ]

    # New songs using saved samples
    new_sample_usage = []
    if saved_sample_ids:
        saved_sources = await db.execute(
            select(Sample.source_song_id).where(Sample.id.in_(saved_sample_ids))
        )
        source_ids = [r[0] for r in saved_sources.all()]
        if source_ids:
            result = await db.execute(
                select(Song).join(Sample, Sample.target_song_id == Song.id)
                .where(Sample.source_song_id.in_(source_ids))
                .order_by(desc(Song.release_year))
                .limit(5)
            )
            new_sample_usage = [
                {"title": s.title, "year": s.release_year}
                for s in result.scalars().all()
            ]

    # Trending discovery
    trending = await generate_discover_playlist(db, limit=10)

    return {
        "date": "today",
        "new_from_follows": new_from_follows,
        "new_sample_usage": new_sample_usage,
        "trending_samples": trending,
    }
