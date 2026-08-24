from typing import List
from app.schemas.enums import DataType, PolicyAction
from app.schemas.protection import DetectionResult

class MaskingEngine:
    @staticmethod
    def resolve_overlaps(detections: List[DetectionResult]) -> List[DetectionResult]:
        """
        Sort detections and filter out any overlapping entities, prioritizing 
        the one starting first (and longest span in case of tie).
        """
        sorted_detections = sorted(detections, key=lambda d: (d.start, -d.end))
        non_overlapping: List[DetectionResult] = []
        last_end = 0
        for d in sorted_detections:
            if d.start >= last_end:
                non_overlapping.append(d)
                last_end = d.end
        return non_overlapping

    @staticmethod
    def get_replacement_token(data_type: DataType, action: PolicyAction) -> str:
        """
        Produce replacement placeholders matching spec examples (e.g. [EMAIL REDACTED] or [PASSWORD BLOCKED]).
        """
        type_str = data_type.value.replace("_", " ")
        if action == PolicyAction.BLOCK:
            return f"[{type_str} BLOCKED]"
        else:
            return f"[{type_str} REDACTED]"

    @classmethod
    def apply_masking(cls, content: str, detections: List[DetectionResult]) -> tuple[str, bool]:
        """
        Mask or Block entities in the text.
        Returns the sanitized text and a boolean indicating whether any BLOCK action occurred.
        """
        resolved_detections = cls.resolve_overlaps(detections)
        
        # Sort in reverse order of start index to safely replace in-place
        sorted_reverse = sorted(resolved_detections, key=lambda d: d.start, reverse=True)
        
        sanitized = content
        any_blocked = False
        
        for d in sorted_reverse:
            if d.recommended_action == PolicyAction.ALLOW:
                continue
                
            replacement = cls.get_replacement_token(d.type, d.recommended_action)
            sanitized = sanitized[:d.start] + replacement + sanitized[d.end:]
            
            if d.recommended_action == PolicyAction.BLOCK:
                any_blocked = True
                
        return sanitized, any_blocked
