"""Graph API — collaboration network + sample relationship graph"""

from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter(prefix="/api/v1/graph", tags=["graph"])


@router.get("/collaborations")
async def collaboration_graph(
    artist_id: str = Query(..., description="Center artist ID"),
    depth: int = Query(2, ge=1, le=3),
    db: AsyncSession = Depends(get_db),
):
    """Build a collaboration network graph centered on an artist."""
    from app.db.repository import collab_get_network, artist_get_discography, credit_get_by_artist

    # Build real network from credits
    songs = await artist_get_discography(db, artist_id)
    credits = await credit_get_by_artist(db, artist_id)

    nodes = [{"id": artist_id, "name": "", "type": "center"}]
    edges = []
    seen = {artist_id}

    for c in credits[:20]:
        if c.artist_id not in seen:
            nodes.append({"id": c.artist_id, "name": "", "type": c.role.value})
            seen.add(c.artist_id)
        edges.append({"source": artist_id, "target": c.artist_id, "type": c.role.value, "song_id": c.song_id})

    return {"success": True, "data": {"nodes": nodes, "edges": edges}, "meta": {"depth": depth, "source": "database"}}
    return {
        "success": True,
        "data": network,
        "meta": {"depth": depth, "source": "database"},
    }


@router.get("/sample-network")
async def sample_network(
    song_id: str = Query(...),
    depth: int = Query(2, ge=1, le=3),
):
    """
    Build a sample relationship graph:
    - This song → samples it uses → original songs
    - Original songs → other songs that sampled them
    """
    return {
        "success": True,
        "data": {
            "center_song": song_id,
            "upstream": [],   # samples → originals
            "downstream": [],  # originals → other users
        },
        "meta": {"depth": depth},
    }
