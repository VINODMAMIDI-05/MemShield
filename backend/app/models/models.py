import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="USER") # USER or ADMIN
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime(timezone=True), nullable=True)

    settings = relationship("Setting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="owner", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete")

class Setting(Base):
    __tablename__ = "settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    protection_enabled = Column(Boolean, default=True)
    detection_mode = Column(String(50), default="standard") # standard, strict
    processing_mode = Column(String(50), default="realtime")
    notification_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="settings")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scope = Column(String(50), default="USER") # USER or ORGANIZATION
    data_type = Column(String(100), nullable=False) # e.g. EMAIL, PHONE, PASSWORD
    sensitivity = Column(String(50), nullable=False) # e.g. CONFIDENTIAL, HIGHLY_CONFIDENTIAL
    action = Column(String(50), nullable=False) # e.g. ALLOW, MASK, BLOCK
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="policies")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String(100), nullable=False) # e.g. transcript, web_chat
    status = Column(String(50), default="CREATED") # CREATED, ACTIVE, PROCESSING, COMPLETED, ERROR, CLOSED
    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    ended_at = Column(DateTime(timezone=True), nullable=True)
    total_detected = Column(Integer, default=0)
    total_masked = Column(Integer, default=0)
    total_blocked = Column(Integer, default=0)

    user = relationship("User", back_populates="sessions")
    detections = relationship("DetectionEvent", back_populates="session", cascade="all, delete-orphan")
    sanitized_contents = relationship("SanitizedContent", back_populates="session", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="session", cascade="all, delete-orphan")

class DetectionEvent(Base):
    __tablename__ = "detection_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    data_type = Column(String(100), nullable=False)
    sensitivity = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    action = Column(String(50), nullable=False)
    source = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="detections")

class SanitizedContent(Base):
    __tablename__ = "sanitized_contents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(100), default="text") # text, transcript, summary
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="sanitized_contents")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(String(100), nullable=False) # e.g. SENSITIVE_DATA_BLOCKED
    action = Column(String(50), nullable=False)
    data_type = Column(String(100), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    log_metadata = Column("metadata", JSON, nullable=True) # additional details, e.g. confidence scores (raw content must NOT be stored here)

    user = relationship("User", back_populates="audit_logs")
    session = relationship("Session", back_populates="audit_logs")
