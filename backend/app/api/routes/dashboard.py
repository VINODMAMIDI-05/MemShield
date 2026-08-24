from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DbSession
from sqlalchemy import func
from typing import List

from app.db.session import get_db
from app.models.models import Session, Setting, AuditLog, User
from app.schemas.db_schemas import DashboardStats, AuditLogResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=DashboardStats)
def get_dashboard_data(
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch user settings to determine protection status
    settings_record = current_user.settings
    protection_status = "ACTIVE" if (settings_record and settings_record.protection_enabled) else "OFF"

    # Aggregate session metrics
    stats = db.query(
        func.sum(Session.total_detected).label("detected"),
        func.sum(Session.total_masked).label("masked"),
        func.sum(Session.total_blocked).label("blocked")
    ).filter(Session.user_id == current_user.id).first()

    total_detected = int(stats.detected or 0)
    total_masked = int(stats.masked or 0)
    total_blocked = int(stats.blocked or 0)

    # Active sessions count (states ACTIVE or PROCESSING)
    active_sessions = db.query(Session).filter(
        Session.user_id == current_user.id,
        Session.status.in_(["ACTIVE", "PROCESSING"])
    ).count()

    # Recent Audit Logs
    recent_logs = db.query(AuditLog).filter(
        AuditLog.user_id == current_user.id
    ).order_by(AuditLog.timestamp.desc()).limit(10).all()

    return DashboardStats(
        protection_status=protection_status,
        total_detected=total_detected,
        total_masked=total_masked,
        total_blocked=total_blocked,
        active_sessions=active_sessions,
        recent_events=recent_logs
    )
