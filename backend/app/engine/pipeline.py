import uuid
from typing import List, Dict, Optional
from datetime import datetime, timezone

from app.schemas.enums import DataType, SensitivityLevel, PolicyAction
from app.schemas.protection import (
    NormalizedInput,
    DetectionResult,
    DetectionSummary,
    ProtectionResult
)
from app.engine.detector.regex import RegexDetector
from app.engine.detector.keyword import KeywordDetector
from app.engine.classifier.classifier import EntityClassifier
from app.engine.scoring.risk import RiskScoringEngine
from app.engine.policy.policy import PolicyEngine
from app.engine.masking.masking import MaskingEngine

class ProtectionPipeline:
    def __init__(self):
        self.detectors = [
            RegexDetector(),
            KeywordDetector()
        ]

    def protect(
        self,
        content: str,
        session_id: str,
        actor_id: Optional[str] = None,
        source: str = "text",
        destination: str = "AI",
        custom_policies: Optional[Dict[DataType, PolicyAction]] = None
    ) -> ProtectionResult:
        """
        Execute the complete MemShield protection pipeline.
        """
        # Step 1: Normalize Input
        normalized_input = NormalizedInput(
            session_id=session_id,
            source=source,
            actor_id=actor_id,
            content=content,
            timestamp=datetime.now(timezone.utc)
        )

        # Step 2: Run Detectors to obtain raw matches
        raw_detections = []
        for detector in self.detectors:
            try:
                matches = detector.detect(normalized_input.content)
                raw_detections.extend(matches)
            except Exception:
                # Fail-Closed behavior if detection encounters an internal error
                return ProtectionResult(
                    safe_content="[PROTECTION ERROR: DETECTION FAILED]",
                    risk="CRITICAL",
                    detections=[],
                    blocked=True,
                    safe_for_ai=False
                )

        # Step 3: Process, Classify, Score, and Evaluate Policies for each raw match
        processed_detections: List[DetectionResult] = []
        for raw in raw_detections:
            det_id = f"det_{uuid.uuid4().hex[:8]}"
            sensitivity = EntityClassifier.classify(raw.type)
            action = PolicyEngine.evaluate(raw.type, custom_policies)
            risk_score, risk_level = RiskScoringEngine.calculate_risk(
                raw.type, sensitivity, raw.confidence, destination
            )

            processed_detections.append(DetectionResult(
                id=det_id,
                type=raw.type,
                sensitivity=sensitivity,
                confidence=raw.confidence,
                risk_score=risk_score,
                start=raw.start,
                end=raw.end,
                source=raw.detector_name,
                recommended_action=action,
                session_id=session_id,
                actor_id=actor_id
            ))

        # Step 4: Apply Masking & Blocking
        try:
            safe_content, any_blocked = MaskingEngine.apply_masking(
                normalized_input.content,
                processed_detections
            )
        except Exception:
            # Fail-Closed behavior if masking fails
            return ProtectionResult(
                safe_content="[PROTECTION ERROR: MASKING FAILED]",
                risk="CRITICAL",
                detections=[],
                blocked=True,
                safe_for_ai=False
            )

        # Step 5: Output Validation (Fail-Closed Checks)
        # Ensure that no raw sensitive value that was flagged for MASK or BLOCK remains in safe_content
        validation_failed = False
        resolved_detections = MaskingEngine.resolve_overlaps(processed_detections)
        for d in resolved_detections:
            if d.recommended_action in (PolicyAction.MASK, PolicyAction.BLOCK):
                # Fetch raw value from original content
                raw_val = normalized_input.content[d.start:d.end]
                # If raw value is still present in safe_content, validation fails
                if raw_val in safe_content:
                    validation_failed = True
                    break

        # Calculate final overall session risk
        risk_levels = [RiskScoringEngine.calculate_risk(d.type, d.sensitivity, d.confidence, destination)[1] for d in resolved_detections]
        if "CRITICAL" in risk_levels:
            overall_risk = "CRITICAL"
        elif "HIGH" in risk_levels:
            overall_risk = "HIGH"
        elif "MEDIUM" in risk_levels:
            overall_risk = "MEDIUM"
        else:
            overall_risk = "LOW"

        # Determine safe_for_ai
        # Content is NOT safe for AI if validation fails, or if a highly confidential field is blocked
        safe_for_ai = not validation_failed and not any_blocked

        # Build final detection summaries
        summaries = [
            DetectionSummary(
                type=d.type,
                sensitivity=d.sensitivity,
                confidence=d.confidence,
                action=d.recommended_action
            )
            for d in resolved_detections
        ]

        return ProtectionResult(
            safe_content=safe_content,
            risk=overall_risk,
            detections=summaries,
            blocked=any_blocked,
            safe_for_ai=safe_for_ai
        )
