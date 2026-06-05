"""Audio API — recognition, fingerprinting, analysis jobs"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import Optional

router = APIRouter(prefix="/api/v1/audio", tags=["audio"])


@router.post("/recognize")
async def recognize_audio(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
):
    """
    Audio recognition endpoint.
    Accepts an audio file → generates Chromaprint fingerprint → queries AcoustID.
    TODO: integrate acoustid-py for actual fingerprint matching.
    """
    if not file.content_type or not file.content_type.startswith("audio"):
        raise HTTPException(400, "File must be audio (mp3, wav, m4a, etc.)")

    # Read the uploaded audio
    audio_bytes = await file.read()
    if len(audio_bytes) > 15 * 1024 * 1024:  # 15MB max
        raise HTTPException(400, "Audio file too large (max 15MB)")

    # TODO: Save to temp file → run chromaprint → query AcoustID
    # fingerprint = acoustid.fingerprint_file(temp_path)
    # matches = acoustid.lookup(API_KEY, fingerprint)

    return {
        "success": True,
        "data": {
            "status": "processing",
            "message": "Audio recognition pipeline pending AcoustID integration",
        },
    }


@router.post("/analyze")
async def analyze_audio(
    file: UploadFile = File(...),
    song_title: Optional[str] = None,
    artist_name: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
):
    """
    Full audio analysis pipeline:
    1. Demucs source separation (drums/bass/vocals/other)
    2. Chromaprint fingerprint each stem
    3. Cross-reference against known sample database
    4. Detect BPM + key
    Returns an analysis job ID for progress tracking.
    """
    if not file.content_type or not file.content_type.startswith("audio"):
        raise HTTPException(400, "File must be audio")

    audio_bytes = await file.read()
    job_id = f"job_{len(audio_bytes)}"  # TODO: real UUID

    # TODO: Create AnalysisJob in DB
    # TODO: Enqueue Celery task: demucs → chromaprint → match → store

    return {
        "success": True,
        "data": {
            "job_id": job_id,
            "status": "enqueued",
            "message": "Analysis pipeline starting. Poll /api/v1/audio/jobs/{job_id} for progress.",
        },
    }


@router.get("/jobs/{job_id}")
async def get_analysis_job(job_id: str):
    """Get the status of an audio analysis job"""
    return {
        "success": True,
        "data": {
            "job_id": job_id,
            "status": "pending",
            "progress": 0,
            "result": None,
        },
    }
