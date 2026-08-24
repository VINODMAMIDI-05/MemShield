import pytest
from app.schemas.enums import DataType, PolicyAction
from app.schemas.raw_detection import RawDetection
from app.schemas.protection import DetectionResult
from app.engine.detector.regex import RegexDetector
from app.engine.detector.keyword import KeywordDetector
from app.engine.masking.masking import MaskingEngine
from app.engine.pipeline import ProtectionPipeline

def test_regex_detector():
    detector = RegexDetector()
    text = "My email is john@example.com, phone is +91 98765 43210, PAN is ABCDE1234F."
    detections = detector.detect(text)
    
    types = [d.type for d in detections]
    assert DataType.EMAIL in types
    assert DataType.PHONE in types
    assert DataType.PAN in types

    # Test invalid credit card fails Luhn check
    text_invalid_cc = "Credit card: 1234-5678-1234-5678"
    detections_cc = detector.detect(text_invalid_cc)
    assert not any(d.type == DataType.CREDIT_CARD for d in detections_cc)

    # Test valid credit card passes Luhn check (Visa test card 4111...)
    text_valid_cc = "Credit card: 4111 1111 1111 1111"
    detections_cc_valid = detector.detect(text_valid_cc)
    assert any(d.type == DataType.CREDIT_CARD for d in detections_cc_valid)


def test_keyword_detector():
    detector = KeywordDetector()
    text = "My password is SecretPassword123. My API key is sk-12345."
    detections = detector.detect(text)
    
    password_det = next((d for d in detections if d.type == DataType.PASSWORD), None)
    assert password_det is not None
    assert password_det.value == "SecretPassword123"


def test_masking_engine_overlaps():
    # Setup overlapping detections:
    # "My email is john@example.com"
    # Overlap A: john@example.com (start=12, end=28)
    # Overlap B: john (start=12, end=16) -> should be discarded because A comes first and is longer
    detections = [
        DetectionResult(
            id="1", type=DataType.EMAIL, sensitivity="CONFIDENTIAL", confidence=0.99,
            risk_score=0.7, start=12, end=28, source="Regex", recommended_action=PolicyAction.MASK, session_id="s1"
        ),
        DetectionResult(
            id="2", type=DataType.PERSONAL_IDENTIFIER, sensitivity="CONFIDENTIAL", confidence=0.8,
            risk_score=0.5, start=12, end=16, source="Keyword", recommended_action=PolicyAction.MASK, session_id="s1"
        )
    ]
    resolved = MaskingEngine.resolve_overlaps(detections)
    assert len(resolved) == 1
    assert resolved[0].type == DataType.EMAIL


def test_protection_pipeline_golden_rule():
    pipeline = ProtectionPipeline()
    text = "My password is BlueTiger123 and my email is john@example.com."
    
    result = pipeline.protect(
        content=text,
        session_id="session_test",
        actor_id="user_test"
    )
    
    # Expected: "My password is [PASSWORD BLOCKED] and my email is [EMAIL REDACTED]."
    assert result.safe_content == "My password is [PASSWORD BLOCKED] and my email is [EMAIL REDACTED]."
    assert result.blocked is True  # Because password triggers BLOCK action
    assert result.safe_for_ai is False  # Cannot send blocked content to AI
    
    # Verify detections are summarized
    types = [d.type for d in result.detections]
    assert DataType.PASSWORD in types
    assert DataType.EMAIL in types
