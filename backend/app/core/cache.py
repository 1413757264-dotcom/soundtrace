"""Cache — Redis with in-memory fallback"""

import time
from typing import Optional

redis_client = None

try:
    import redis.asyncio as aioredis
    from app.core.config import settings
    redis_client = aioredis.from_url(
        settings.REDIS_URL, encoding="utf-8", decode_responses=True,
        socket_connect_timeout=1,
    )
except Exception:
    pass

# In-memory fallback
_memory: dict = {}

async def cache_get(key: str) -> Optional[str]:
    if redis_client:
        try:
            return await redis_client.get(key)
        except Exception:
            pass
    entry = _memory.get(key)
    if entry and time.time() < entry[1]:
        return entry[0]
    if entry:
        del _memory[key]
    return None

async def cache_set(key: str, value: str, ttl: int = 3600) -> bool:
    if redis_client:
        try:
            await redis_client.setex(key, ttl, value)
            return True
        except Exception:
            pass
    _memory[key] = (value, time.time() + ttl)
    return True

async def cache_delete(key: str) -> bool:
    if redis_client:
        try:
            await redis_client.delete(key)
            return True
        except Exception:
            pass
    _memory.pop(key, None)
    return True
