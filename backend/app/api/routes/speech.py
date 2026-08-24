from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session as DbSession
from app.db.session import get_db
from app.models.models import User
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/transcribe")
def transcribe_audio(
    file: UploadFile = File(...),
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a', '.webm')):
        raise HTTPException(status_code=400, detail="Invalid audio format")
    
    # Return a mock transcription containing sensitive entities for pipeline testing
    return {
        "filename": file.filename,
        "transcript": "Meeting transcript: Speaker A stated that my password is BlueTiger123 and my email is john@example.com."
    }
