"""WhoSampled data aggregation — the core sample traceability engine"""

import re
import httpx
from typing import Optional
from bs4 import BeautifulSoup
from app.core.config import settings
from app.core.cache import cache_get, cache_set

WHOSAMPLED_SEARCH = f"{settings.WHOSAMPLED_BASE_URL}/search/tracks"
WHOSAMPLED_TRACK = f"{settings.WHOSAMPLED_BASE_URL}"

HEADERS = {
    "User-Agent": "SoundTrace/1.0 (MusicDiscovery; +https://soundtrace.app)",
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}


async def search_whosampled(query: str) -> list[dict]:
    """Search WhoSampled for a track — returns list of matching track URLs"""
    cache_key = f"ws:search:{query}"
    cached = await cache_get(cache_key)
    if cached:
        import json
        return json.loads(cached)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                WHOSAMPLED_SEARCH,
                params={"q": query},
                headers=HEADERS,
                follow_redirects=True,
            )
            if resp.status_code != 200:
                return []

            soup = BeautifulSoup(resp.text, "html.parser")
            results = []

            # Parse search results
            for item in soup.select(".searchResult, .trackEntry, .listEntry")[:10]:
                link = item.select_one("a[href]")
                title_el = item.select_one(".trackName, .title")
                artist_el = item.select_one(".trackArtist, .artist")
                year_el = item.select_one(".trackYear, .year")

                if link and title_el:
                    results.append({
                        "title": title_el.get_text(strip=True),
                        "artist": artist_el.get_text(strip=True) if artist_el else "",
                        "year": year_el.get_text(strip=True) if year_el else "",
                        "url": WHOSAMPLED_TRACK + link["href"] if link["href"].startswith("/") else link["href"],
                    })

            # Cache for 24 hours
            import json
            await cache_set(cache_key, json.dumps(results), ttl=86400)

            return results
    except Exception:
        return []


async def get_track_samples(whosampled_url: str) -> dict:
    """Parse a WhoSampled track page for sample relationships"""
    cache_key = f"ws:samples:{whosampled_url}"
    cached = await cache_get(cache_key)
    if cached:
        import json
        return json.loads(cached)

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(whosampled_url, headers=HEADERS)
            if resp.status_code != 200:
                return {"samples_used": [], "sampled_by": []}

            soup = BeautifulSoup(resp.text, "html.parser")

            # Samples used in this track
            samples_used = []
            for section in soup.select(".section, .samplesUsed, .sampledInTrack"):
                for item in section.select(".trackEntry, .sampleEntry, .listEntry"):
                    title_el = item.select_one(".trackName, .title")
                    artist_el = item.select_one(".trackArtist, .artist")
                    year_el = item.select_one(".trackYear, .year")

                    if title_el:
                        samples_used.append({
                            "title": title_el.get_text(strip=True),
                            "artist": artist_el.get_text(strip=True) if artist_el else "",
                            "year": _extract_year(year_el.get_text(strip=True)) if year_el else None,
                        })

            # Tracks that sampled this one
            sampled_by = []
            for section in soup.select(".section, .sampledBy, .wasSampledIn"):
                for item in section.select(".trackEntry, .sampleEntry, .listEntry"):
                    title_el = item.select_one(".trackName, .title")
                    artist_el = item.select_one(".trackArtist, .artist")

                    if title_el:
                        sampled_by.append({
                            "title": title_el.get_text(strip=True),
                            "artist": artist_el.get_text(strip=True) if artist_el else "",
                        })

            result = {"samples_used": samples_used, "sampled_by": sampled_by}

            import json
            await cache_set(cache_key, json.dumps(result), ttl=86400 * 7)  # 7 day cache
            return result
    except Exception:
        return {"samples_used": [], "sampled_by": []}


async def find_sample_matches(artist: str, title: str) -> list[dict]:
    """Search WhoSampled for a specific track and return its samples"""
    query = f"{artist} {title}"
    tracks = await search_whosampled(query)

    if not tracks:
        return []

    # Try exact match first
    best_match = None
    for t in tracks:
        if (artist.lower() in t["artist"].lower() and
            title.lower() in t["title"].lower()):
            best_match = t
            break

    if not best_match and tracks:
        best_match = tracks[0]

    if not best_match:
        return []

    result = await get_track_samples(best_match["url"])
    return result.get("samples_used", [])


def _extract_year(text: str) -> Optional[int]:
    """Extract year from text like 'Released: 1994'"""
    match = re.search(r'(19|20)\d{2}', text)
    return int(match.group()) if match else None
