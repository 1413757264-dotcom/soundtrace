"""Middleware — rate limiting, request logging, CORS"""

import time
from collections import defaultdict
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings


class RateLimiter(BaseHTTPMiddleware):
    """Simple in-memory rate limiter (production: use Redis-based)"""

    def __init__(self, app):
        super().__init__(app)
        self.requests: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip health/docs endpoints
        if request.url.path in ("/api/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = 86400  # 24 hours
        limit = settings.RATE_LIMIT_FREE

        # Clean old entries
        self.requests[client_ip] = [
            t for t in self.requests[client_ip] if now - t < window
        ]

        if len(self.requests[client_ip]) >= limit:
            raise HTTPException(429, "Rate limit exceeded. Upgrade to Pro for unlimited access.")

        self.requests[client_ip].append(now)
        return await call_next(request)


class RequestLogger(BaseHTTPMiddleware):
    """Log all API requests"""

    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start
        print(f"[API] {request.method} {request.url.path} → {response.status_code} ({duration:.3f}s)")
        return response
