from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session as DbSession
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel

from app.db.session import get_db
from app.db.mongodb import save_mongo_ai_memory, get_mongo_ai_memories
from app.models.models import Session, User, SanitizedContent
from app.engine.pipeline import ProtectionPipeline
from app.integrations.ai.gateway import AIGateway
from app.api.deps import get_current_user

router = APIRouter()
pipeline = ProtectionPipeline()

class AIRequest(BaseModel):
    session_id: str
    prompt: str

@router.post("/process")
async def process_ai_request(
    req: AIRequest,
    db: DbSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify session and ownership
    session = db.query(Session).filter(Session.id == req.session_id, Session.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Step 1 & 2: Input Protection Check
    input_protection = pipeline.protect(
        content=req.prompt,
        session_id=req.session_id,
        actor_id=current_user.id,
        source="ai_prompt"
    )

    # Fail-Closed logic: If prompt is not safe for AI, block transaction
    if not input_protection.safe_for_ai:
        # Record blocked poisoning attempt in MongoDB
        await save_mongo_ai_memory(
            session_id=session.id,
            safe_content="[BLOCKED PROMPT]",
            detections_count=len(input_protection.detections),
            memory_status="POISONING_ATTEMPT_BLOCKED",
            vector_indexed=False,
            metadata={"source": "ai_prompt", "reason": "Disallowed credentials"}
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="AI Request Blocked: Prompt contains sensitive entities disallowed by active policy."
        )

    # Step 3: Send safe content to AI
    ai_raw_response = AIGateway.generate_response(input_protection.safe_content)

    # Step 4: Run AI Output Protection check
    output_protection = pipeline.protect(
        content=ai_raw_response,
        session_id=req.session_id,
        actor_id=current_user.id,
        source="ai_response"
    )

    # Save output to sanitized content database table (type: summary)
    db_content = SanitizedContent(
        session_id=session.id,
        content=output_protection.safe_content,
        content_type="summary"
    )
    db.add(db_content)
    db.commit()

    # Record safe context in MongoDB AI Memory Collection
    await save_mongo_ai_memory(
        session_id=session.id,
        safe_content=output_protection.safe_content,
        detections_count=len(input_protection.detections),
        memory_status="SANITIZED_VECTOR_READY",
        vector_indexed=True,
        metadata={"prompt_masked": input_protection.safe_content}
    )

    return {
        "prompt_masked": input_protection.safe_content,
        "ai_response": output_protection.safe_content,
        "memory_persisted": True
    }

@router.get("/memory/atlas", response_model=List[Dict[str, Any]])
async def list_mongo_ai_memories(
    limit: int = Query(default=50, le=100),
    session_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve sanitized AI memory context records directly from MongoDB Atlas collection.
    """
    return await get_mongo_ai_memories(limit=limit, session_id=session_id)
