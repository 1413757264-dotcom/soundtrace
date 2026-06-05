"""Neo4j graph database — collaboration networks + sample relationships"""

from typing import Optional
from neo4j import AsyncGraphDatabase, AsyncDriver
from app.core.config import settings

driver: Optional[AsyncDriver] = None

try:
    driver = AsyncGraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
    )
except Exception:
    pass


async def init_graph():
    """Create constraints and indexes"""
    if not driver:
        return
    try:
        async with driver.session() as session:
            await session.run("CREATE CONSTRAINT artist_id IF NOT EXISTS FOR (a:Artist) REQUIRE a.id IS UNIQUE")
            await session.run("CREATE CONSTRAINT song_id IF NOT EXISTS FOR (s:Song) REQUIRE s.id IS UNIQUE")
            await session.run("CREATE INDEX sample_type IF NOT EXISTS FOR ()-[r:SAMPLED]-() ON (r.type)")
    except Exception:
        pass


async def create_artist_node(artist_id: str, name: str, genres: list[str] = []):
    """Create or update an artist node"""
    if not driver:
        return
    try:
        async with driver.session() as session:
            await session.run(
                """
                MERGE (a:Artist {id: $id})
                SET a.name = $name, a.genres = $genres
                """,
                id=artist_id, name=name, genres=genres,
            )
    except Exception:
        pass


async def create_song_node(song_id: str, title: str, year: int, artist_id: str):
    """Create a song node and link to artist"""
    if not driver:
        return
    try:
        async with driver.session() as session:
            await session.run(
                """
                MERGE (a:Artist {id: $artist_id})
                MERGE (s:Song {id: $song_id})
                SET s.title = $title, s.year = $year
                MERGE (a)-[:PERFORMED]->(s)
                """,
                artist_id=artist_id, song_id=song_id, title=title, year=year,
            )
    except Exception:
        pass


async def create_sample_relationship(
    source_song_id: str,
    target_song_id: str,
    sample_type: str,
    confidence: float = 1.0,
):
    """Create a SAMPLE relationship between two songs"""
    if not driver:
        return
    try:
        async with driver.session() as session:
            await session.run(
                """
                MATCH (src:Song {id: $source_id})
                MATCH (tgt:Song {id: $target_id})
                MERGE (tgt)-[r:SAMPLED {type: $type}]->(src)
                SET r.confidence = $confidence
                """,
                source_id=source_song_id,
                target_id=target_song_id,
                type=sample_type,
                confidence=confidence,
            )
    except Exception:
        pass


async def create_collaboration_relationship(
    artist_a_id: str,
    artist_b_id: str,
    relationship_type: str,
    song_id: str,
):
    """Create collaboration edge between artists"""
    if not driver:
        return
    try:
        async with driver.session() as session:
            await session.run(
                """
                MATCH (a:Artist {id: $a_id})
                MATCH (b:Artist {id: $b_id})
                MERGE (a)-[r:COLLABORATED {type: $rel_type, song_id: $song_id}]->(b)
                """,
                a_id=artist_a_id, b_id=artist_b_id,
                rel_type=relationship_type, song_id=song_id,
            )
    except Exception:
        pass


async def get_collaboration_network(artist_id: str, depth: int = 2) -> dict:
    """Query collaboration network from Neo4j"""
    if not driver:
        return {"nodes": [], "edges": []}

    try:
        async with driver.session() as session:
            result = await session.run(
                """
                MATCH (center:Artist {id: $artist_id})
                MATCH path = (center)-[*1..$depth]-(connected:Artist)
                WHERE connected.id <> center.id
                WITH nodes(path) as pathNodes, relationships(path) as pathRels
                UNWIND pathNodes as n
                WITH DISTINCT n as node
                OPTIONAL MATCH (node)-[r:COLLABORATED]-(other:Artist)
                RETURN
                    collect(DISTINCT {id: node.id, name: node.name, genres: node.genres}) as nodes,
                    collect(DISTINCT {source: startNode(r).id, target: endNode(r).id, type: r.type}) as edges
                """,
                artist_id=artist_id, depth=depth,
            )
            record = await result.single()
            if record:
                return {
                    "nodes": record["nodes"] or [],
                    "edges": record["edges"] or [],
                }
    except Exception:
        pass

    return {"nodes": [], "edges": []}


async def get_sample_chain(source_song_id: str, direction: str = "both") -> dict:
    """Trace the sample chain: upstream or downstream or both"""
    if not driver:
        return {"upstream": [], "downstream": []}

    upstream = []
    downstream = []

    try:
        async with driver.session() as session:
            if direction in ("upstream", "both"):
                result = await session.run(
                    """
                    MATCH (tgt:Song)-[r:SAMPLED*1..3]->(src:Song)
                    WHERE tgt.id = $song_id
                    RETURN src.title as title, src.id as id, size(r) as depth
                    ORDER BY depth
                    """,
                    song_id=source_song_id,
                )
                upstream = [
                    {"title": r["title"], "id": r["id"], "depth": r["depth"]}
                    async for r in result
                ]

            if direction in ("downstream", "both"):
                result = await session.run(
                    """
                    MATCH (src:Song)<-[r:SAMPLED*1..3]-(tgt:Song)
                    WHERE src.id = $song_id
                    RETURN tgt.title as title, tgt.id as id, size(r) as depth
                    ORDER BY depth
                    """,
                    song_id=source_song_id,
                )
                downstream = [
                    {"title": r["title"], "id": r["id"], "depth": r["depth"]}
                    async for r in result
                ]
    except Exception:
        pass

    return {"upstream": upstream, "downstream": downstream}


async def close_graph():
    """Close Neo4j driver"""
    if driver:
        await driver.close()
