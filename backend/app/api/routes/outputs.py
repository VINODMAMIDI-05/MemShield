from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session as DbSession
import io

from app.db.session import get_db
from app.models.models import Session, SanitizedContent, User
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/{session_id}/transcript")
def get_session_transcript(
    session_id: str,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify session and ownership
    session = db.query(Session).filter(Session.id == session_id, Session.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    contents = db.query(SanitizedContent).filter(
        SanitizedContent.session_id == session_id,
        SanitizedContent.content_type.in_(["transcript", "text"])
    ).order_by(SanitizedContent.created_at.asc()).all()

    merged_text = "\n".join([c.content for c in contents])
    return {
        "session_id": session_id,
        "transcript": merged_text or "No transcript content available for this session."
    }

@router.get("/{session_id}/summary")
def get_session_summary(
    session_id: str,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(Session).filter(Session.id == session_id, Session.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    contents = db.query(SanitizedContent).filter(
        SanitizedContent.session_id == session_id,
        SanitizedContent.content_type == "summary"
    ).order_by(SanitizedContent.created_at.asc()).all()

    merged_text = "\n".join([c.content for c in contents])
    return {
        "session_id": session_id,
        "summary": merged_text or "No summary available for this session."
    }

@router.post("/{session_id}/pdf")
def export_session_pdf(
    session_id: str,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(Session).filter(Session.id == session_id, Session.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    contents = db.query(SanitizedContent).filter(
        SanitizedContent.session_id == session_id
    ).order_by(SanitizedContent.created_at.asc()).all()

    # Generate a simple mock PDF text representation
    pdf_buffer = io.BytesIO()
    pdf_buffer.write(b"%PDF-1.4\n")
    pdf_buffer.write(f"%%Title: MemShield Session {session_id} Export\n".encode())
    pdf_buffer.write(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    pdf_buffer.write(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    pdf_buffer.write(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>\nendobj\n")
    
    # Document content
    stream_content = f"MemShield Privacy Protection Session Report\nSession ID: {session_id}\nDate: {session.started_at.strftime('%Y-%m-%d %H:%M:%S')}\nStatus: {session.status}\n\n"
    stream_content += f"Summary Statistics:\n- Total Entities Detected: {session.total_detected}\n- Total Entities Masked: {session.total_masked}\n- Total Entities Blocked: {session.total_blocked}\n\n"
    stream_content += "Sanitized Content Log:\n"
    for c in contents:
        stream_content += f"[{c.content_type.upper()}]: {c.content}\n"
        
    stream_len = len(stream_content)
    pdf_buffer.write(f"4 0 obj\n<< /Length {stream_len} >>\nstream\n{stream_content}\nendstream\nendobj\n".encode())
    pdf_buffer.write(b"xref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n310\n%%EOF\n")
    
    pdf_buffer.seek(0)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=memshield_session_{session_id}.pdf"}
    )
