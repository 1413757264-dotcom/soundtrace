"""Push notification service — Firebase Cloud Messaging + APNs"""

import httpx
from typing import Optional
from app.core.config import settings


class PushService:
    """Send push notifications to mobile devices"""

    def __init__(self):
        self.fcm_url = "https://fcm.googleapis.com/fcm/send"
        self.fcm_key: Optional[str] = None  # Set from env/secrets

    async def send_sample_alert(
        self, user_token: str, sample_title: str, song_title: str, artist_name: str,
    ):
        """Notify user: 'Your saved sample was used in a new song'"""
        payload = {
            "to": user_token,
            "notification": {
                "title": "🔔 采样被新歌使用",
                "body": f"《{sample_title}》采样被 {artist_name} 用在新歌《{song_title}》中",
            },
            "data": {
                "type": "sample_alert",
                "sample_title": sample_title,
                "song_title": song_title,
                "artist": artist_name,
            },
        }
        return await self._send(payload)

    async def send_new_discovery(
        self, user_token: str, title: str, body: str, song_id: str,
    ):
        """Daily discovery push"""
        payload = {
            "to": user_token,
            "notification": {"title": title, "body": body},
            "data": {"type": "discovery", "song_id": song_id},
        }
        return await self._send(payload)

    async def send_analysis_complete(self, user_token: str, job_id: str, song_title: str):
        """Notify user that their submitted song analysis is complete"""
        payload = {
            "to": user_token,
            "notification": {
                "title": "✅ 采样分析完成",
                "body": f"《{song_title}》的采样拆解已完成，点击查看",
            },
            "data": {"type": "analysis_done", "job_id": job_id},
        }
        return await self._send(payload)

    async def _send(self, payload: dict) -> bool:
        if not self.fcm_key:
            return False
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.post(
                    self.fcm_url,
                    json=payload,
                    headers={
                        "Authorization": f"key={self.fcm_key}",
                        "Content-Type": "application/json",
                    },
                )
                return resp.status_code == 200
        except Exception:
            return False


push_service = PushService()
