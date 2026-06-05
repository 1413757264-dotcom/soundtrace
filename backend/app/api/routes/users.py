"""User API — favorites, history, follows, digest"""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.db.repository import (
    saved_get_by_user, saved_toggle,
    history_add, history_get_by_user,
    follow_toggle, follow_get_artists,
    user_get_by_id,
)
from app.services.recommendations import daily_digest
from app.services.notifications import push_service

router = APIRouter(prefix="/api/v1/users", tags=["users"])


# ─── Favorites ────────────────────────────────────────

@router.get("/{user_id}/saved")
async def get_saved_samples(user_id: str, db: AsyncSession = Depends(get_db)):
    saved = await saved_get_by_user(db, user_id)
    return {
        "success": True,
        "data": [
            {"id": s.id, "sample_id": s.sample_id, "saved_at": s.created_at.isoformat()}
            for s in saved
        ],
    }


@router.post("/{user_id}/saved/{sample_id}")
async def toggle_saved(user_id: str, sample_id: str, db: AsyncSession = Depends(get_db)):
    saved = await saved_toggle(db, user_id, sample_id)
    return {"success": True, "data": {"saved": saved, "sample_id": sample_id}}


# ─── History ──────────────────────────────────────────

@router.get("/{user_id}/history")
async def get_history(user_id: str, limit: int = Query(50), db: AsyncSession = Depends(get_db)):
    history = await history_get_by_user(db, user_id, limit)
    return {
        "success": True,
        "data": [
            {"id": h.id, "song_id": h.song_id, "viewed_at": h.viewed_at.isoformat()}
            for h in history
        ],
    }


@router.post("/{user_id}/history/{song_id}")
async def add_history(user_id: str, song_id: str, db: AsyncSession = Depends(get_db)):
    entry = await history_add(db, user_id, song_id)
    return {"success": True, "data": {"id": entry.id, "song_id": song_id}}


# ─── Follows ──────────────────────────────────────────

@router.get("/{user_id}/follows")
async def get_follows(user_id: str, db: AsyncSession = Depends(get_db)):
    follows = await follow_get_artists(db, user_id)
    return {"success": True, "data": follows}


@router.post("/{user_id}/follow/{artist_id}")
async def toggle_follow(user_id: str, artist_id: str, db: AsyncSession = Depends(get_db)):
    following = await follow_toggle(db, user_id, artist_id)
    return {"success": True, "data": {"following": following, "artist_id": artist_id}}


# ─── Digest ───────────────────────────────────────────

@router.get("/{user_id}/digest")
async def get_digest(user_id: str, db: AsyncSession = Depends(get_db)):
    """Daily discovery digest"""
    digest = await daily_digest(db, user_id)
    return {"success": True, "data": digest}


# ─── Profile ──────────────────────────────────────────

@router.get("/{user_id}/profile")
async def get_profile(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await user_get_by_id(db, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    saved = await saved_get_by_user(db, user_id)
    follows = await follow_get_artists(db, user_id)
    return {
        "success": True,
        "data": {
            "username": user.username,
            "display_name": user.display_name,
            "avatar_url": user.avatar_url,
            "is_artist": user.is_artist,
            "tier": user.tier,
            "saved_count": len(saved),
            "follows_count": len(follows),
            "joined_at": user.created_at.isoformat() if user.created_at else None,
        },
    }


# ─── Push Token ───────────────────────────────────────

@router.post("/{user_id}/push-token")
async def register_push_token(user_id: str, token: str = Query(...)):
    """Register device push token for notifications"""
    # TODO: Store token in DB
    return {"success": True, "data": {"registered": True}}
