from typing import Dict, Optional
from app.schemas.enums import DataType, PolicyAction

class PolicyEngine:
    # Default policy defined in Section 19 of spec.md
    DEFAULT_POLICY: Dict[DataType, PolicyAction] = {
        DataType.EMAIL: PolicyAction.MASK,
        DataType.PHONE: PolicyAction.MASK,
        DataType.AADHAAR: PolicyAction.BLOCK,
        DataType.PAN: PolicyAction.MASK,
        DataType.CREDIT_CARD: PolicyAction.BLOCK,
        DataType.BANK_ACCOUNT: PolicyAction.BLOCK,
        DataType.PASSWORD: PolicyAction.BLOCK,
        DataType.API_KEY: PolicyAction.BLOCK,
        DataType.AUTH_TOKEN: PolicyAction.BLOCK,
        DataType.PRIVATE_KEY: PolicyAction.BLOCK,
        DataType.ADDRESS: PolicyAction.MASK,
        DataType.PERSONAL_IDENTIFIER: PolicyAction.MASK,
    }

    @classmethod
    def evaluate(cls, data_type: DataType, custom_policies: Optional[Dict[DataType, PolicyAction]] = None) -> PolicyAction:
        """
        Evaluate policy action for a DataType, using custom policies if available, falling back to defaults.
        """
        if custom_policies and data_type in custom_policies:
            return custom_policies[data_type]
        return cls.DEFAULT_POLICY.get(data_type, PolicyAction.MASK)
