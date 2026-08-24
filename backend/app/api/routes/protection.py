from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DbSession
from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel

from app.db.session import get_db
from app.db.mongodb import save_mongo_audit_log, save_mongo_ai_memory
from app.models.models import Session, User, Policy, DetectionEvent, SanitizedContent, AuditLog
from app.schemas.enums import DataType, PolicyAction
from app.schemas.protection import ProtectionResult
from app.engine.pipeline import ProtectionPipeline
from app.api.deps import get_current_user

router = APIRouter()
pipeline = ProtectionPipeline()

class SanitizeRequest(BaseModel):
    session_id: str
    content: str
    source: str

@router.post("/sanitize", response_model=ProtectionResult)
async def sanitize_content(
    req: SanitizeRequest,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve and validate session
    session = db.query(Session).filter(Session.id == req.session_id, Session.user_id == current_user.id).first()
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    # Load user specific active policies to override defaults
    db_policies = db.query(Policy).filter(Policy.owner_id == current_user.id, Policy.enabled == True).all()
    custom_policies = {}
    for p in db_policies:
        try:
            custom_policies[DataType(p.data_type)] = PolicyAction(p.action)
        except ValueError:
            continue

    # Execute protection pipeline
    result = pipeline.protect(
        content=req.content,
        session_id=req.session_id,
        actor_id=current_user.id,
        source=req.source,
        custom_policies=custom_policies
    )

    # If protection fails (fail-closed), raise error
    if not result.safe_for_ai and result.safe_content.startswith("[PROTECTION ERROR"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Protection failed"
        )

    # Map detected events & update DB
    detected_count = 0
    masked_count = 0
    blocked_count = 0

    # Parse through pipeline detections and write them to database (excluding raw values)
    for det in result.detections:
        # Create database detection record
        db_det = DetectionEvent(
            session_id=session.id,
            data_type=det.type.value,
            sensitivity=det.sensitivity.value,
            confidence=det.confidence,
            risk_score=0.9 if det.sensitivity.value == "HIGHLY_CONFIDENTIAL" else 0.6,
            action=det.action.value,
            source="Pipeline"
        )
        db.add(db_det)
        
        detected_count += 1
        if det.action == PolicyAction.MASK:
            masked_count += 1
            # Write SQLite audit log
            audit = AuditLog(
                user_id=current_user.id,
                session_id=session.id,
                event_type="SENSITIVE_DATA_MASKED",
                action="MASK",
                data_type=det.type.value,
                timestamp=datetime.now(timezone.utc),
                log_metadata={"confidence": det.confidence}
            )
            db.add(audit)

            # Persist to MongoDB Atlas Vault
            await save_mongo_audit_log(
                event_type="SENSITIVE_DATA_MASKED",
                action="MASK",
                data_type=det.type.value,
                session_id=session.id,
                user_id=current_user.id,
                risk_level="MEDIUM",
                metadata={"confidence": det.confidence, "source": req.source}
            )

        elif det.action == PolicyAction.BLOCK:
            blocked_count += 1
            # Write SQLite audit log
            audit = AuditLog(
                user_id=current_user.id,
                session_id=session.id,
                event_type="SENSITIVE_DATA_BLOCKED",
                action="BLOCK",
                data_type=det.type.value,
                timestamp=datetime.now(timezone.utc),
                log_metadata={"confidence": det.confidence}
            )
            db.add(audit)

            # Persist to MongoDB Atlas Vault
            await save_mongo_audit_log(
                event_type="SENSITIVE_DATA_BLOCKED",
                action="BLOCK",
                data_type=det.type.value,
                session_id=session.id,
                user_id=current_user.id,
                risk_level="CRITICAL",
                metadata={"confidence": det.confidence, "source": req.source}
            )

    # Save sanitized content (raw content must NOT be stored in DB)
    db_sanitized = SanitizedContent(
        session_id=session.id,
        content=result.safe_content,
        content_type=req.source
    )
    db.add(db_sanitized)

    # Record safe context in MongoDB AI Memory Collection
    await save_mongo_ai_memory(
        session_id=session.id,
        safe_content=result.safe_content,
        detections_count=detected_count,
        memory_status="DE_IDENTIFIED_VECTOR_READY" if result.safe_for_ai else "MEMORY_POISON_BLOCKED",
        vector_indexed=result.safe_for_ai,
        metadata={"source": req.source, "risk": result.risk}
    )

    # Update session counters
    session.total_detected += detected_count
    session.total_masked += masked_count
    session.total_blocked += blocked_count
    if session.status == "CREATED":
        session.status = "ACTIVE"

    db.commit()
    return result
