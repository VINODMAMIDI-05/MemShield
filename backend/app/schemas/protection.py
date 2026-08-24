from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.enums import SensitivityLevel, DataType, PolicyAction

class NormalizedInput(BaseModel):
    session_id: str
    source: str
    actor_id: Optional[str] = None
    content: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

class DetectionResult(BaseModel):
    id: str
    type: DataType
    sensitivity: SensitivityLevel
    confidence: float
    risk_score: float
    start: int
    end: int
    source: str
    recommended_action: PolicyAction
    session_id: str
    actor_id: Optional[str] = None

class DetectionSummary(BaseModel):
    type: DataType
    sensitivity: SensitivityLevel
    confidence: float
    action: PolicyAction

class ProtectionResult(BaseModel):
    safe_content: str
    risk: str  # LOW, MEDIUM, HIGH, CRITICAL
    detections: List[DetectionSummary]
    blocked: bool
    safe_for_ai: bool
