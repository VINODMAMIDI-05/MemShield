from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DbSession
from typing import List

from app.db.session import get_db
from app.models.models import DetectionEvent, Session, User
from app.schemas.enums import DataType
from app.schemas.db_schemas import DetectionEventResponse
from app.engine.pipeline import ProtectionPipeline
from app.api.deps import get_current_user
from pydantic import BaseModel

router = APIRouter()
pipeline = ProtectionPipeline()

class AnalyzeRequest(BaseModel):
    content: str

@router.post("/analyze")
def analyze_content(
    req: AnalyzeRequest,
    current_user: User = Depends(get_current_user)
):
    # Runs the detectors to extract raw detections, but doesn't persist to DB
    raw_detections = []
    for detector in pipeline.detectors:
        try:
            matches = detector.detect(req.content)
            raw_detections.extend(matches)
        except Exception:
            pass
            
    return {
        "detections": [
            {
                "type": r.type.value,
                "confidence": r.confidence,
                "start": r.start,
                "end": r.end
            }
            for r in raw_detections
        ]
    }

@router.get("/types", response_model=List[str])
def get_supported_types():
    return [t.value for t in DataType]

@router.get("/history", response_model=List[DetectionEventResponse])
def get_detection_history(
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Query detection events that belong to user's sessions
    return db.query(DetectionEvent).join(Session).filter(
        Session.user_id == current_user.id
    ).order_by(DetectionEvent.created_at.desc()).all()
