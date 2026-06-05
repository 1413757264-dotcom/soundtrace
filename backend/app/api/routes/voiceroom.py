"""Voice Room API — WebSocket-based sample discussion rooms"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from typing import Optional
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/v1/rooms", tags=["voiceroom"])

# In-memory room state (production: Redis pub/sub)
rooms: dict[str, dict] = {}  # room_id -> {name, topic, participants, messages}
connections: dict[str, list[WebSocket]] = {}


@router.get("")
async def list_rooms():
    """List active rooms"""
    return {
        "success": True,
        "data": [
            {
                "id": rid,
                "name": r["name"],
                "topic": r["topic"],
                "sample_id": r.get("sample_id"),
                "participant_count": len(connections.get(rid, [])),
            }
            for rid, r in rooms.items()
        ],
    }


@router.post("/create")
async def create_room(
    name: str = Query(...),
    topic: str = Query(...),
    sample_id: Optional[str] = Query(None),
    song_id: Optional[str] = Query(None),
):
    """Create a new discussion room"""
    import uuid
    room_id = uuid.uuid4().hex[:8]
    rooms[room_id] = {
        "name": name,
        "topic": topic,
        "sample_id": sample_id,
        "song_id": song_id,
        "participants": 0,
        "messages": [],
    }
    connections[room_id] = []
    return {"success": True, "data": {"room_id": room_id, "name": name}}


@router.get("/{room_id}")
async def get_room(room_id: str):
    """Get room info + messages"""
    room = rooms.get(room_id)
    if not room:
        return {"success": False, "error": {"code": "NOT_FOUND", "message": "房间不存在"}}
    return {
        "success": True,
        "data": {
            **room,
            "participant_count": len(connections.get(room_id, [])),
        },
    }


@router.websocket("/{room_id}/ws")
async def room_websocket(websocket: WebSocket, room_id: str, username: str = "anonymous"):
    """WebSocket for real-time room chat"""
    await websocket.accept()

    if room_id not in connections:
        connections[room_id] = []

    connections[room_id].append(websocket)

    # Notify others
    join_msg = {"type": "system", "username": username, "text": f"{username} 加入了房间"}
    rooms[room_id]["messages"].append(join_msg) if room_id in rooms else None

    try:
        # Broadcast join
        for conn in connections.get(room_id, []):
            if conn != websocket:
                try:
                    await conn.send_json(join_msg)
                except Exception:
                    pass

        while True:
            data = await websocket.receive_json()
            msg = {
                "type": "message",
                "username": username,
                "text": data.get("text", ""),
            }

            if room_id in rooms:
                rooms[room_id]["messages"].append(msg)
                # Keep last 500 messages
                rooms[room_id]["messages"] = rooms[room_id]["messages"][-500:]

            # Broadcast
            dead = []
            for conn in connections.get(room_id, []):
                try:
                    await conn.send_json(msg)
                except Exception:
                    dead.append(conn)
            for d in dead:
                connections[room_id].remove(d)

    except WebSocketDisconnect:
        pass
    finally:
        if websocket in connections.get(room_id, []):
            connections[room_id].remove(websocket)

        leave_msg = {"type": "system", "username": username, "text": f"{username} 离开了房间"}
        for conn in connections.get(room_id, []):
            try:
                await conn.send_json(leave_msg)
            except Exception:
                pass
