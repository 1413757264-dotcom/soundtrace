"""
音迹 SoundTrace — Backend Configuration
环境变量 + .env 文件管理
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # ── App ──
    APP_NAME: str = "音迹 SoundTrace API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"  # development | staging | production

    # ── Server ──
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = ["*"]

    # ── Database ──
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/soundtrace.db"
    DATABASE_URL_SYNC: str = "sqlite:///./data/soundtrace.db"

    # ── Redis ──
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── JWT Auth ──
    JWT_SECRET: str = "soundtrace-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # ── Spotify API ──
    SPOTIFY_CLIENT_ID: Optional[str] = None
    SPOTIFY_CLIENT_SECRET: Optional[str] = None
    SPOTIFY_REDIRECT_URI: str = "http://localhost:8000/api/auth/spotify/callback"

    # ── MusicBrainz ──
    MUSICBRAINZ_API_URL: str = "https://musicbrainz.org/ws/2"
    MUSICBRAINZ_USER_AGENT: str = "SoundTrace/1.0"

    # ── AcoustID ──
    ACOUSTID_API_KEY: Optional[str] = None

    # ── WhoSampled ──
    WHOSAMPLED_BASE_URL: str = "https://www.whosampled.com"

    # ── Elasticsearch ──
    ELASTICSEARCH_URL: str = "http://localhost:9200"

    # ── Neo4j ──
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "soundtrace"

    # ── Celery / Redis Queue ──
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── Storage ──
    STORAGE_BACKEND: str = "local"  # local | s3
    STORAGE_LOCAL_PATH: str = "./data/audio"
    S3_BUCKET: Optional[str] = None
    S3_REGION: Optional[str] = None

    # ── Rate Limiting ──
    RATE_LIMIT_FREE: int = 100   # requests per day (free tier)
    RATE_LIMIT_PRO: int = 10000  # requests per day (pro tier)

    # ── Audio Pipeline ──
    DEMUCS_MODEL: str = "htdemucs"  # htdemucs | htdemucs_ft | htdemucs_6s
    AUDIO_SAMPLE_RATE: int = 44100
    AUDIO_MAX_DURATION: int = 600  # max 10 min audio for analysis

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
