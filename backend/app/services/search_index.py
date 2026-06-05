"""Elasticsearch integration — full-text search index for songs/samples/artists"""

from typing import Optional
from elasticsearch import AsyncElasticsearch
from app.core.config import settings

es: Optional[AsyncElasticsearch] = None

try:
    es = AsyncElasticsearch(settings.ELASTICSEARCH_URL)
except Exception:
    pass


SONG_INDEX = "soundtrace_songs"
SAMPLE_INDEX = "soundtrace_samples"
ARTIST_INDEX = "soundtrace_artists"

SONG_MAPPING = {
    "properties": {
        "title": {"type": "text", "analyzer": "standard"},
        "title_suggest": {"type": "completion"},
        "artist_name": {"type": "text", "analyzer": "standard"},
        "album": {"type": "text"},
        "release_year": {"type": "integer"},
        "bpm": {"type": "integer"},
        "key_signature": {"type": "keyword"},
        "sub_genre": {"type": "keyword"},
        "genre": {"type": "keyword"},
        "popularity": {"type": "integer"},
        "energy": {"type": "float"},
        "danceability": {"type": "float"},
    }
}

SAMPLE_MAPPING = {
    "properties": {
        "source_title": {"type": "text"},
        "source_artist": {"type": "text"},
        "target_title": {"type": "text"},
        "target_artist": {"type": "text"},
        "type": {"type": "keyword"},
        "source_genre": {"type": "keyword"},
        "confidence": {"type": "float"},
        "release_year": {"type": "integer"},
    }
}


async def init_indexes():
    """Create ES indexes with proper mappings"""
    if not es:
        return
    try:
        if not await es.indices.exists(index=SONG_INDEX):
            await es.indices.create(index=SONG_INDEX, body={"mappings": SONG_MAPPING})
        if not await es.indices.exists(index=SAMPLE_INDEX):
            await es.indices.create(index=SAMPLE_INDEX, body={"mappings": SAMPLE_MAPPING})
        if not await es.indices.exists(index=ARTIST_INDEX):
            await es.indices.create(index=ARTIST_INDEX)
    except Exception:
        pass


async def index_song(song_data: dict):
    """Index a song document"""
    if not es:
        return
    try:
        await es.index(
            index=SONG_INDEX,
            id=song_data.get("id"),
            document=song_data,
            refresh=True,
        )
    except Exception:
        pass


async def index_sample(sample_data: dict):
    """Index a sample document"""
    if not es:
        return
    try:
        await es.index(
            index=SAMPLE_INDEX,
            id=sample_data.get("id"),
            document=sample_data,
            refresh=True,
        )
    except Exception:
        pass


async def search_fulltext(
    query: str,
    index: str = SONG_INDEX,
    filters: Optional[dict] = None,
    size: int = 20,
    from_: int = 0,
) -> list[dict]:
    """Full-text search with optional filters"""
    if not es:
        return []

    body: dict = {
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": query,
                            "fields": ["title^3", "artist_name^2", "album"],
                            "fuzziness": "AUTO",
                        }
                    }
                ]
            }
        },
        "size": size,
        "from": from_,
    }

    if filters:
        filter_clauses = []
        if filters.get("genre"):
            filter_clauses.append({"term": {"sub_genre": filters["genre"]}})
        if filters.get("year_min") or filters.get("year_max"):
            range_filter = {"release_year": {}}
            if filters.get("year_min"):
                range_filter["release_year"]["gte"] = filters["year_min"]
            if filters.get("year_max"):
                range_filter["release_year"]["lte"] = filters["year_max"]
            filter_clauses.append({"range": range_filter})
        if filters.get("bpm_min") or filters.get("bpm_max"):
            range_filter = {"bpm": {}}
            if filters.get("bpm_min"):
                range_filter["bpm"]["gte"] = filters["bpm_min"]
            if filters.get("bpm_max"):
                range_filter["bpm"]["lte"] = filters["bpm_max"]
            filter_clauses.append({"range": range_filter})
        if filter_clauses:
            body["query"]["bool"]["filter"] = filter_clauses

    try:
        result = await es.search(index=index, body=body)
        return [hit["_source"] for hit in result["hits"]["hits"]]
    except Exception:
        return []


async def bulk_index_songs(songs: list[dict]):
    """Bulk index multiple songs"""
    if not es:
        return
    try:
        from elasticsearch.helpers import async_bulk
        actions = [
            {"_index": SONG_INDEX, "_id": s.get("id"), "_source": s}
            for s in songs
        ]
        await async_bulk(es, actions)
    except Exception:
        pass
