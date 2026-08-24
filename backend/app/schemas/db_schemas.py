from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class SettingResponse(BaseModel):
    id: str
    user_id: str
    protection_enabled: bool
    detection_mode: str
    processing_mode: str
    notification_enabled: bool

    model_config = {"from_attributes": True}

class SettingUpdate(BaseModel):
    protection_enabled: Optional[bool] = None
    detection_mode: Optional[str] = None
    processing_mode: Optional[str] = None
    notification_enabled: Optional[bool] = None

class PolicyBase(BaseModel):
    scope: str = "USER"
    data_type: str
    sensitivity: str
    action: str
    enabled: bool = True

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    scope: Optional[str] = None
    data_type: Optional[str] = None
    sensitivity: Optional[str] = None
    action: Optional[str] = None
    enabled: Optional[bool] = None

class PolicyResponse(PolicyBase):
    id: str
    owner_id: str
    created_at: datetime

    model_config = {"from_attributes": True}

class SessionBase(BaseModel):
    source: str

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: str
    user_id: str
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    total_detected: int
    total_masked: int
    total_blocked: int

    model_config = {"from_attributes": True}

class DetectionEventResponse(BaseModel):
    id: str
    session_id: str
    data_type: str
    sensitivity: str
    confidence: float
    risk_score: float
    action: str
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}

class SanitizedContentResponse(BaseModel):
    id: str
    session_id: str
    content: str
    content_type: str
    created_at: datetime

    model_config = {"from_attributes": True}

class AuditLogResponse(BaseModel):
    id: str
    user_id: str
    session_id: Optional[str] = None
    event_type: str
    action: str
    data_type: Optional[str] = None
    timestamp: datetime
    log_metadata: Optional[Dict[str, Any]] = Field(default=None, serialization_alias="metadata")

    model_config = {"from_attributes": True}

class DashboardStats(BaseModel):
    protection_status: str
    total_detected: int
    total_masked: int
    total_blocked: int
    active_sessions: int
    recent_events: List[AuditLogResponse] = []
