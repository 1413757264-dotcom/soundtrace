"""Song Enrichment Pipeline — Spotify + MusicBrainz + WhoSampled"""
import httpx
from typing import Optional
from app.core.cache import cache_get, cache_set
from app.services.spotify import _get_access_token
import json

SPOTIFY_API = "https://api.spotify.com/v1"
MUSICBRAINZ_API = "https://musicbrainz.org/ws/2"


async def enrich_song(artist: str, title: str) -> dict:
    """Enrich a song with data from all available sources"""
    cache_key = f"enrich:{artist}:{title}"
    cached = await cache_get(cache_key)
    if cached:
        return json.loads(cached)

    result = {
        "artist": artist, "title": title,
        "bpm": None, "key": None, "energy": None,
        "danceability": None, "acousticness": None,
        "genres": [], "credits": [], "samples": [],
        "source": {"bpm": "", "credits": "", "samples": ""},
    }

    # ── 1. Spotify — BPM, Key, Energy ──
    await _enrich_spotify(result, artist, title)

    # ── 2. MusicBrainz — Credits ──
    await _enrich_musicbrainz(result, artist, title)

    # ── 3. WhoSampled — Samples ──
    await _enrich_whosampled(result, artist, title)

    await cache_set(cache_key, json.dumps(result), ttl=86400)
    return result


async def _enrich_spotify(result: dict, artist: str, title: str):
    """Get BPM, key, energy from Spotify"""
    try:
        token = await _get_access_token()
        if not token:
            return

        async with httpx.AsyncClient(timeout=10) as client:
            # Search for track
            resp = await client.get(
                f"{SPOTIFY_API}/search",
                headers={"Authorization": f"Bearer {token}"},
                params={"q": f"{artist} {title}", "type": "track", "limit": 1},
            )
            if resp.status_code != 200:
                return

            tracks = resp.json().get("tracks", {}).get("items", [])
            if not tracks:
                return

            track = tracks[0]
            track_id = track["id"]

            # Get audio features
            resp2 = await client.get(
                f"{SPOTIFY_API}/audio-features/{track_id}",
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp2.status_code == 200:
                af = resp2.json()
                result["bpm"] = round(af.get("tempo", 0)) if af.get("tempo") else None
                result["key"] = _spotify_key(af)
                result["energy"] = af.get("energy")
                result["danceability"] = af.get("danceability")
                result["acousticness"] = af.get("acousticness")
                result["source"]["bpm"] = "spotify"

            # Get artist genres
            artist_id = track["artists"][0]["id"] if track.get("artists") else None
            if artist_id:
                resp3 = await client.get(
                    f"{SPOTIFY_API}/artists/{artist_id}",
                    headers={"Authorization": f"Bearer {token}"},
                )
                if resp3.status_code == 200:
                    result["genres"] = resp3.json().get("genres", [])
    except Exception:
        pass


async def _enrich_musicbrainz(result: dict, artist: str, title: str):
    """Get credits/producers from MusicBrainz"""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{MUSICBRAINZ_API}/recording",
                params={"query": f"{artist} {title}", "fmt": "json", "limit": 3},
                headers={"User-Agent": "SoundTrace/1.0"},
            )
            if resp.status_code != 200:
                return

            recordings = resp.json().get("recordings", [])
            if not recordings:
                return

            # Get first matching recording
            for rec in recordings:
                rec_artist = rec.get("artist-credit", [{}])[0].get("name", "")
                if artist.lower() in rec_artist.lower():
                    credits_raw = rec.get("artist-credit", [])
                    for c in credits_raw:
                        role = c.get("name", "")
                        if c.get("artist"):
                            result["credits"].append({
                                "name": c["artist"].get("name", ""),
                                "role": "producer" if "producer" in str(c).lower() else "artist",
                            })
                    if result["credits"]:
                        result["source"]["credits"] = "musicbrainz"
                    break
    except Exception:
        pass


async def _enrich_whosampled(result: dict, artist: str, title: str):
    """Get sample data from WhoSampled"""
    try:
        from app.services.whosampled import find_sample_matches
        samples = await find_sample_matches(artist, title)
        if samples:
            result["samples"] = samples[:10]
            result["source"]["samples"] = "whosampled"
    except Exception:
        pass


def _spotify_key(af: dict) -> Optional[str]:
    if af.get("key") is None or af["key"] == -1:
        return None
    keys = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
    mode = "minor" if af.get("mode") == 0 else "major"
    return f"{keys[af['key']]} {mode}"
