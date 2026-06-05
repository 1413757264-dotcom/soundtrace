"""Deezer API — free, no auth required, 80M+ tracks"""

import httpx
from typing import Optional
from app.core.cache import cache_get, cache_set
import json

DEEZER_API = "https://api.deezer.com"


async def search_tracks(query: str, limit: int = 20) -> dict:
    """Search Deezer for tracks — free, no API key needed"""
    cache_key = f"deezer:search:{query}:{limit}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{DEEZER_API}/search/track",
                params={"q": query, "limit": limit},
            )
            if resp.status_code == 200:
                data = resp.json()
                await cache_set(cache_key, json.dumps(data), ttl=300)
                return data
            return {"data": [], "total": 0}
    except Exception:
        return {"data": [], "total": 0}


async def get_track(track_id: int) -> Optional[dict]:
    """Get a single track by Deezer ID"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{DEEZER_API}/track/{track_id}")
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    return None


async def get_artist(artist_id: int) -> Optional[dict]:
    """Get artist info"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{DEEZER_API}/artist/{artist_id}")
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    return None


async def get_artist_top_tracks(artist_id: int, limit: int = 10) -> list[dict]:
    """Get artist's top tracks"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{DEEZER_API}/artist/{artist_id}/top",
                params={"limit": limit},
            )
            if resp.status_code == 200:
                return resp.json().get("data", [])
    except Exception:
        pass
    return []


def deezer_track_to_dict(track: dict) -> dict:
    """Convert Deezer track to our Song format"""
    artist = track.get("artist", {})
    album = track.get("album", {})
    return {
        "title": track.get("title", ""),
        "deezer_id": str(track.get("id", "")),
        "primary_artist_name": artist.get("name", "Unknown") if isinstance(artist, dict) else str(artist),
        "primary_artist_deezer_id": str(artist.get("id", "")) if isinstance(artist, dict) else "",
        "album_title": album.get("title", "") if isinstance(album, dict) else "",
        "release_year": None,  # Deezer doesn't return year in search
        "duration_ms": track.get("duration", 0) * 1000,
        "cover_art_url": album.get("cover_medium", "") if isinstance(album, dict) else "",
        "bpm": track.get("bpm", 0),
        "key_signature": None,
        "preview_url": track.get("preview", ""),
        "rank": track.get("rank", 0),
    }
