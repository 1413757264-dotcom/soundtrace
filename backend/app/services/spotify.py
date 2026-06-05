"""Spotify API integration — search, audio features, preview URLs"""

import base64
import httpx
from typing import Optional
from app.core.config import settings
from app.core.cache import cache_get, cache_set


SPOTIFY_TOKEN_KEY = "spotify:access_token"
SPOTIFY_API = "https://api.spotify.com/v1"


async def _get_access_token() -> str:
    """Get or refresh Spotify access token (cached)"""
    cached = await cache_get(SPOTIFY_TOKEN_KEY)
    if cached:
        return cached

    if not settings.SPOTIFY_CLIENT_ID or not settings.SPOTIFY_CLIENT_SECRET:
        return ""

    auth = base64.b64encode(
        f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}".encode()
    ).decode()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://accounts.spotify.com/api/token",
            headers={"Authorization": f"Basic {auth}"},
            data={"grant_type": "client_credentials"},
        )
        data = resp.json()
        token = data.get("access_token", "")
        expires = data.get("expires_in", 3600)

        if token:
            await cache_set(SPOTIFY_TOKEN_KEY, token, ttl=expires - 60)

        return token


async def search_tracks(query: str, limit: int = 20, offset: int = 0) -> dict:
    """Search Spotify for tracks"""
    token = await _get_access_token()
    if not token:
        return {"tracks": {"items": [], "total": 0}}

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SPOTIFY_API}/search",
            headers={"Authorization": f"Bearer {token}"},
            params={"q": query, "type": "track", "limit": limit, "offset": offset},
        )
        if resp.status_code != 200:
            print(f"[Spotify] Search failed: {resp.status_code} {resp.text[:200]}")
            return {"tracks": {"items": [], "total": 0}}
        return resp.json()


async def get_track(track_id: str) -> Optional[dict]:
    """Get a single track by Spotify ID"""
    token = await _get_access_token()
    if not token:
        return None

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SPOTIFY_API}/tracks/{track_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        if resp.status_code == 200:
            return resp.json()
        return None


async def get_audio_features(track_id: str) -> Optional[dict]:
    """Get audio features (BPM, key, energy, etc.)"""
    token = await _get_access_token()
    if not token:
        return None

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SPOTIFY_API}/audio-features/{track_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        if resp.status_code == 200:
            return resp.json()
        return None


async def get_artist(artist_id: str) -> Optional[dict]:
    """Get artist info from Spotify"""
    token = await _get_access_token()
    if not token:
        return None

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SPOTIFY_API}/artists/{artist_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
        if resp.status_code == 200:
            return resp.json()
        return None


async def get_artist_top_tracks(artist_id: str) -> list[dict]:
    """Get artist's top tracks"""
    token = await _get_access_token()
    if not token:
        return []

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{SPOTIFY_API}/artists/{artist_id}/top-tracks",
            headers={"Authorization": f"Bearer {token}"},
            params={"market": "US"},
        )
        if resp.status_code == 200:
            return resp.json().get("tracks", [])
        return []


def spotify_track_to_song_dict(track: dict, audio_features: Optional[dict] = None) -> dict:
    """Convert Spotify track object to our Song format"""
    return {
        "title": track["name"],
        "spotify_id": track["id"],
        "primary_artist_name": track["artists"][0]["name"] if track.get("artists") else "Unknown",
        "primary_artist_spotify_id": track["artists"][0]["id"] if track.get("artists") else None,
        "album_title": track["album"]["name"] if track.get("album") else None,
        "release_year": int(track["album"]["release_date"][:4]) if track.get("album", {}).get("release_date") else None,
        "duration_ms": track["duration_ms"],
        "cover_art_url": track["album"]["images"][0]["url"] if track.get("album", {}).get("images") else None,
        "bpm": round(audio_features["tempo"]) if audio_features and audio_features.get("tempo") else None,
        "key_signature": _spotify_key_to_string(audio_features) if audio_features else None,
        "energy": audio_features.get("energy") if audio_features else None,
        "danceability": audio_features.get("danceability") if audio_features else None,
        "acousticness": audio_features.get("acousticness") if audio_features else None,
        "valence": audio_features.get("valence") if audio_features else None,
        "preview_url": track.get("preview_url"),
        "featured_artists": [
            {"name": a["name"], "spotify_id": a["id"]}
            for a in track.get("artists", [])[1:]
        ] if len(track.get("artists", [])) > 1 else [],
    }


def _spotify_key_to_string(af: dict) -> Optional[str]:
    """Convert Spotify key (0-11) + mode to readable string"""
    if not af or af.get("key") is None:
        return None
    keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    key = keys[af["key"]]
    mode = "minor" if af.get("mode") == 0 else "major"
    return f"{key} {mode}"
