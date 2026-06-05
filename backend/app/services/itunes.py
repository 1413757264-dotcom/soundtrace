"""iTunes Search API — free, no auth, works globally, 80M+ tracks"""

import httpx
from app.core.cache import cache_get, cache_set
from typing import Optional
import json

ITUNES_API = "https://itunes.apple.com"


async def search_tracks(query: str, limit: int = 50, offset: int = 0, artist: str = "") -> dict:
    """Search iTunes — supports up to 200 per request, optional artist filter"""
    actual = min(limit, 200)
    cache_key = f"itunes:search:{query}:{artist}:{actual}:{offset}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    term = f"{artist} {query}".strip() if artist else query

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{ITUNES_API}/search",
                params={"term": term, "entity": "song", "limit": actual, "offset": offset},
            )
            if resp.status_code == 200:
                data = resp.json()
                seen = set()
                unique = []
                for r in data.get("results", []):
                    tid = r.get("trackId")
                    if tid and tid not in seen:
                        # Post-filter: if artist specified, only keep exact artist matches
                        if artist:
                            track_artist = (r.get("artistName") or "").lower()
                            if artist.lower() not in track_artist:
                                continue
                        seen.add(tid)
                        unique.append(r)
                data["results"] = unique
                data["resultCount"] = len(unique)
                await cache_set(cache_key, json.dumps(data), ttl=300)
                return data
            return {"results": [], "resultCount": 0}
    except Exception:
        return {"results": [], "resultCount": 0}


async def search_artist(query: str, limit: int = 10) -> list[dict]:
    """Search for artists"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{ITUNES_API}/search",
                params={"term": query, "entity": "musicArtist", "limit": limit},
            )
            if resp.status_code == 200:
                return resp.json().get("results", [])
    except Exception:
        pass
    return []


async def lookup_artist(artist_id: int) -> Optional[dict]:
    """Get artist details + top songs"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{ITUNES_API}/lookup",
                params={"id": artist_id, "entity": "song", "limit": 20},
            )
            if resp.status_code == 200:
                return resp.json()
    except Exception:
        pass
    return None


def itunes_track_to_dict(track: dict) -> dict:
    """Convert iTunes track to our Song format"""
    return {
        "title": track.get("trackName", ""),
        "itunes_id": str(track.get("trackId", "")),
        "primary_artist_name": track.get("artistName", "Unknown"),
        "primary_artist_itunes_id": str(track.get("artistId", "")),
        "album_title": track.get("collectionName", ""),
        "release_year": int(track["releaseDate"][:4]) if track.get("releaseDate") else None,
        "duration_ms": track.get("trackTimeMillis", 0) or (track.get("trackTime", 0) * 1000),
        "cover_art_url": track.get("artworkUrl100", "").replace("100x100", "600x600"),
        "bpm": None,  # iTunes doesn't provide BPM
        "key_signature": None,
        "preview_url": track.get("previewUrl", ""),
        "genre": track.get("primaryGenreName", ""),
        "price": track.get("trackPrice", 0),
    }
