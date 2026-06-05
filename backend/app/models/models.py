"""SQLAlchemy ORM Models — 音迹 SoundTrace"""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey,
    Text, Enum as SAEnum, Index,
)
from sqlalchemy.types import TypeDecorator, VARCHAR
import json as _json


class JSON(TypeDecorator):
    """JSON type for SQLite compatibility"""
    impl = VARCHAR
    cache_ok = True

    def process_bind_param(self, value, dialect):
        return _json.dumps(value) if value is not None else None

    def process_result_value(self, value, dialect):
        return _json.loads(value) if value else None
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


def gen_id():
    return uuid.uuid4().hex[:16]


# ═══════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════

class SampleType(str, enum.Enum):
    DRUM = "drum"
    MELODY = "melody"
    VOCAL_CHOP = "vocal_chop"
    BASS = "bass"
    FX = "fx"
    TEXTURE = "texture"
    DIALOG = "dialog"


class Genre(str, enum.Enum):
    SOUL = "soul"
    FUNK = "funk"
    BLUES = "blues"
    JAZZ = "jazz"
    ROCK = "rock"
    DISCO = "disco"
    RNB = "rnb"
    ELECTRONIC = "electronic"
    CLASSICAL = "classical"
    WORLD = "world"
    REGGAE = "reggae"
    POP = "pop"
    HIP_HOP = "hip_hop"
    UNKNOWN = "unknown"


class SubGenre(str, enum.Enum):
    BOOM_BAP = "boom_bap"
    TRAP = "trap"
    MEMPHIS = "memphis"
    JAZZ_RAP = "jazz_rap"
    CONSCIOUS = "conscious"
    G_FUNK = "g_funk"
    DRILL = "drill"
    LO_FI = "lo_fi"
    UNDERGROUND = "underground"
    EXPERIMENTAL = "experimental"


class CreditRole(str, enum.Enum):
    PRODUCER = "producer"
    CO_PRODUCER = "co_producer"
    ARRANGER = "arranger"
    SONGWRITER = "songwriter"
    MIXING_ENGINEER = "mixing_engineer"
    MASTERING_ENGINEER = "mastering_engineer"
    FEATURED = "featured"
    SAMPLED_ARTIST = "sampled_artist"


class RelationshipType(str, enum.Enum):
    PRODUCED_FOR = "produced_for"
    FEATURED_WITH = "featured_with"
    CO_WROTE_WITH = "co_wrote_with"
    MIXED_FOR = "mixed_for"


# ═══════════════════════════════════════════════════════
# TABLES
# ═══════════════════════════════════════════════════════

class Artist(Base):
    __tablename__ = "artists"

    id = Column(String(16), primary_key=True, default=gen_id)
    name = Column(String(256), nullable=False, index=True)
    type = Column(String(32), default="primary")  # primary | featured | producer | engineer
    genres = Column(JSON, default=list)            # ["hip_hop", "soul"]
    era = Column(String(16), nullable=True)        # "1990s"
    bio = Column(Text, nullable=True)
    image_url = Column(String(512), nullable=True)
    spotify_id = Column(String(64), nullable=True, index=True, unique=True)
    musicbrainz_id = Column(String(64), nullable=True, index=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    credits = relationship("Credit", back_populates="artist")
    songs_primary = relationship("Song", back_populates="primary_artist_obj", foreign_keys="Song.primary_artist_id")


class Song(Base):
    __tablename__ = "songs"

    id = Column(String(16), primary_key=True, default=gen_id)
    title = Column(String(512), nullable=False, index=True)
    primary_artist_id = Column(String(16), ForeignKey("artists.id"), nullable=False)
    album_title = Column(String(512), nullable=True)
    release_year = Column(Integer, nullable=True, index=True)
    release_date = Column(DateTime, nullable=True)
    duration_ms = Column(Integer, nullable=False)
    bpm = Column(Integer, nullable=True)
    key_signature = Column(String(16), nullable=True)     # "C# minor"
    genre = Column(SAEnum(Genre), default=Genre.UNKNOWN)
    sub_genre = Column(SAEnum(SubGenre), nullable=True)
    cover_art_url = Column(String(512), nullable=True)
    spotify_id = Column(String(64), nullable=True, index=True, unique=True)
    apple_music_id = Column(String(64), nullable=True)
    youtube_id = Column(String(32), nullable=True)
    popularity = Column(Integer, default=0)
    energy = Column(Float, nullable=True)
    danceability = Column(Float, nullable=True)
    acousticness = Column(Float, nullable=True)
    valence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    primary_artist_obj = relationship("Artist", back_populates="songs_primary", foreign_keys=[primary_artist_id])
    credits = relationship("Credit", back_populates="song")
    samples_used = relationship("Sample", foreign_keys="Sample.target_song_id", back_populates="target_song")
    samples_source = relationship("Sample", foreign_keys="Sample.source_song_id", back_populates="source_song")

    __table_args__ = (
        Index("idx_song_title_trgm", "title"),
        Index("idx_song_artist_year", "primary_artist_id", "release_year"),
    )


class Credit(Base):
    __tablename__ = "credits"

    id = Column(String(16), primary_key=True, default=gen_id)
    song_id = Column(String(16), ForeignKey("songs.id", ondelete="CASCADE"), nullable=False)
    artist_id = Column(String(16), ForeignKey("artists.id", ondelete="CASCADE"), nullable=False)
    role = Column(SAEnum(CreditRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    song = relationship("Song", back_populates="credits")
    artist = relationship("Artist", back_populates="credits")

    __table_args__ = (
        Index("idx_credit_song", "song_id"),
        Index("idx_credit_artist_role", "artist_id", "role"),
    )


class Sample(Base):
    __tablename__ = "samples"

    id = Column(String(16), primary_key=True, default=gen_id)
    type = Column(SAEnum(SampleType), nullable=False)
    source_song_id = Column(String(16), ForeignKey("songs.id"), nullable=False)
    source_artist_id = Column(String(16), ForeignKey("artists.id"), nullable=False)
    target_song_id = Column(String(16), ForeignKey("songs.id"), nullable=False, index=True)
    start_time_ms = Column(Integer, nullable=False)         # in original
    end_time_ms = Column(Integer, nullable=False)            # in original
    target_start_time_ms = Column(Integer, nullable=False)   # where used in target
    target_end_time_ms = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0)                  # 0.0–1.0
    attribution_confirmed = Column(Boolean, default=False)    # from WhoSampled vs AI-detected
    waveform_data_url = Column(String(512), nullable=True)
    audio_preview_url = Column(String(512), nullable=True)
    whosampled_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    source_song = relationship("Song", foreign_keys=[source_song_id], back_populates="samples_source")
    target_song = relationship("Song", foreign_keys=[target_song_id], back_populates="samples_used")
    source_artist = relationship("Artist", foreign_keys=[source_artist_id])

    __table_args__ = (
        Index("idx_sample_target", "target_song_id"),
        Index("idx_sample_source", "source_song_id"),
    )


class Collaboration(Base):
    """Derived edge table for graph queries"""
    __tablename__ = "collaborations"

    id = Column(String(16), primary_key=True, default=gen_id)
    source_artist_id = Column(String(16), ForeignKey("artists.id"), nullable=False)
    target_artist_id = Column(String(16), ForeignKey("artists.id"), nullable=False)
    relationship_type = Column(SAEnum(RelationshipType), nullable=False)
    song_id = Column(String(16), ForeignKey("songs.id"), nullable=False)
    weight = Column(Integer, default=1)  # number of collaborations
    created_at = Column(DateTime, default=datetime.utcnow)


class AudioFingerprint(Base):
    """Chromaprint fingerprints for audio recognition"""
    __tablename__ = "audio_fingerprints"

    id = Column(String(16), primary_key=True, default=gen_id)
    song_id = Column(String(16), ForeignKey("songs.id"), nullable=False, index=True)
    stem_type = Column(String(16), default="full")  # full | drums | bass | vocals | other
    fingerprint = Column(Text, nullable=False)        # Chromaprint compressed fingerprint
    duration_ms = Column(Integer, nullable=False)
    sample_rate = Column(Integer, default=44100)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"

    id = Column(String(16), primary_key=True, default=gen_id)
    username = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(256), unique=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    display_name = Column(String(128), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True)
    is_artist = Column(Boolean, default=False)  # music creator account
    tier = Column(String(16), default="free")  # free | pro
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)


class UserSavedSample(Base):
    __tablename__ = "user_saved_samples"

    id = Column(String(16), primary_key=True, default=gen_id)
    user_id = Column(String(16), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sample_id = Column(String(16), ForeignKey("samples.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_saved_user_sample", "user_id", "sample_id", unique=True),
    )


class UserViewHistory(Base):
    __tablename__ = "user_view_history"

    id = Column(String(16), primary_key=True, default=gen_id)
    user_id = Column(String(16), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    song_id = Column(String(16), ForeignKey("songs.id", ondelete="CASCADE"), nullable=False)
    viewed_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_view_user_time", "user_id", "viewed_at"),
    )


class UserFollow(Base):
    __tablename__ = "user_follows"

    id = Column(String(16), primary_key=True, default=gen_id)
    user_id = Column(String(16), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    follows_artist_id = Column(String(16), ForeignKey("artists.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_follow_user_artist", "user_id", "follows_artist_id", unique=True),
    )


class AnalysisJob(Base):
    """Async audio analysis job tracking"""
    __tablename__ = "analysis_jobs"

    id = Column(String(16), primary_key=True, default=gen_id)
    song_id = Column(String(16), ForeignKey("songs.id"), nullable=True)
    status = Column(String(16), default="pending")  # pending | running | done | failed
    audio_url = Column(String(1024), nullable=False)
    progress = Column(Integer, default=0)  # 0–100
    result = Column(JSON, nullable=True)   # detected samples, BPM, key, etc.
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
