from app.schemas.enums import SensitivityLevel, DataType

class RiskScoringEngine:
    @staticmethod
    def calculate_risk(
        data_type: DataType,
        sensitivity: SensitivityLevel,
        confidence: float,
        destination: str = "AI"
    ) -> tuple[float, str]:
        """
        Calculate risk score (0.0 to 1.0) and map to LOW, MEDIUM, HIGH, or CRITICAL.
        """
        # Base risk by sensitivity
        if sensitivity == SensitivityLevel.HIGHLY_CONFIDENTIAL:
            base_risk = 0.90
        elif sensitivity == SensitivityLevel.CONFIDENTIAL:
            base_risk = 0.60
        elif sensitivity == SensitivityLevel.INTERNAL:
            base_risk = 0.30
        else:
            base_risk = 0.10

        # Adjust based on detection confidence
        risk_score = base_risk * confidence

        # Contextual adjustment: sending to AI elevates the risk
        if destination in ("AI", "AI Memory", "AI_GATEWAY"):
            risk_score += 0.10
        
        # Clamp between 0.0 and 1.0
        risk_score = max(0.0, min(1.0, risk_score))

        # Map to Risk Level category
        if risk_score >= 0.85:
            level = "CRITICAL"
        elif risk_score >= 0.60:
            level = "HIGH"
        elif risk_score >= 0.30:
            level = "MEDIUM"
        else:
            level = "LOW"

        return round(risk_score, 2), level
