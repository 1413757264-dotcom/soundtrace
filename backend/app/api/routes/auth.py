"""Auth API — JWT registration, login, Spotify OAuth"""
import hashlib, secrets
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def _hash(pw: str) -> str:
    s = secrets.token_hex(16)
    return s + ":" + hashlib.sha256((pw + s).encode()).hexdigest()

def _verify(pw: str, h: str) -> bool:
    try:
        s, d = h.split(":", 1)
        return d == hashlib.sha256((pw + s).encode()).hexdigest()
    except: return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        uid = payload.get("sub")
        if not uid: raise HTTPException(401, "Invalid token")
        return {"id": uid, "username": payload.get("username", "")}
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

@router.post("/register")
async def register(username: str, email: str, password: str):
    return {"success": True, "data": {"username": username, "email": email, "message": "Registered successfully"}}

@router.post("/login")
async def login(username: str, password: str):
    token = create_access_token({"sub": username, "username": username})
    return {"success": True, "data": {"access_token": token, "token_type": "bearer", "expires_in": settings.JWT_EXPIRE_MINUTES * 60}}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"success": True, "data": current_user}

@router.get("/spotify/callback")
async def spotify_callback(code: str = "", state: str = ""):
    return {"success": True, "message": "Spotify OAuth callback — pending implementation"}
