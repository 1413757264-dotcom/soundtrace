"""音迹 SoundTrace — FastAPI Application Entry Point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.middleware import RateLimiter, RequestLogger
from app.api.routes import search, samples, graph, audio, auth, users, voiceroom, artist_portal

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="单曲DNA溯源引擎 — 采样拆解 + 制作人人脉 + 曲风脉络",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc",
)

# ── Middleware ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLogger)
if not settings.DEBUG:
    app.add_middleware(RateLimiter)

# ── Routers ──
app.include_router(search.router)
app.include_router(samples.router)
app.include_router(graph.router)
app.include_router(audio.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(voiceroom.router)
app.include_router(artist_portal.router)


# ── Health ──
@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.APP_VERSION}


@app.get("/api/v1/stats")
async def stats():
    return {
        "success": True,
        "data": {
            "total_songs": 0, "total_samples": 0, "total_artists": 0,
            "total_fingerprints": 0, "analysis_jobs_today": 0,
            "rate_limit_free": settings.RATE_LIMIT_FREE,
            "rate_limit_pro": settings.RATE_LIMIT_PRO,
        },
    }


# ── Error handlers ──
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        {"success": False, "error": {"code": str(exc.status_code), "message": exc.detail}},
        status_code=exc.status_code,
    )


@app.exception_handler(404)
async def not_found(request, exc):
    return JSONResponse({"success": False, "error": {"code": "NOT_FOUND", "message": "Endpoint not found"}}, status_code=404)


@app.exception_handler(500)
async def internal_error(request, exc):
    return JSONResponse({"success": False, "error": {"code": "INTERNAL", "message": "Internal server error"}}, status_code=500)


@app.exception_handler(429)
async def rate_limited(request, exc):
    return JSONResponse({"success": False, "error": {"code": "RATE_LIMITED", "message": "Rate limit exceeded."}}, status_code=429)


# ── Startup ──
@app.on_event("startup")
async def startup():
    from app.core.database import init_db
    await init_db()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"   DB: SQLite (auto-created)")
    print(f"   Rate limit: {settings.RATE_LIMIT_FREE} req/day (free) | {settings.RATE_LIMIT_PRO} req/day (pro)")


@app.on_event("shutdown")
async def shutdown():
    from app.core.cache import redis_client
    if redis_client:
        await redis_client.close()
    print("👋 Shutdown complete")
