from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session as DbSession
from typing import List, Optional, Dict, Any

from app.db.session import get_db
from app.db.mongodb import get_mongo_audit_logs, mongo_db
from app.models.models import AuditLog, User
from app.schemas.db_schemas import AuditLogResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[AuditLogResponse])
def list_audit_logs(
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id
    ).order_by(AuditLog.timestamp.desc()).all()

@router.get("/atlas", response_model=List[Dict[str, Any]])
async def list_mongo_audit_logs(
    limit: int = Query(default=50, le=100),
    session_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve forensic audit records directly from MongoDB Atlas collection.
    """
    return await get_mongo_audit_logs(limit=limit, session_id=session_id)

@router.get("/{id}", response_model=AuditLogResponse)
def get_audit_log(
    id: str,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = db.query(AuditLog).filter(
        AuditLog.id == id,
        AuditLog.user_id == current_user.id
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return log
