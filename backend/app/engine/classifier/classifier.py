from app.schemas.enums import DataType, SensitivityLevel

class EntityClassifier:
    @staticmethod
    def classify(data_type: DataType) -> SensitivityLevel:
        """
        Classify DataType to its standard SensitivityLevel.
        """
        confidential_types = {
            DataType.EMAIL,
            DataType.PHONE,
            DataType.ADDRESS,
            DataType.PAN,
            DataType.AADHAAR,
            DataType.PERSONAL_IDENTIFIER
        }
        
        highly_confidential_types = {
            DataType.PASSWORD,
            DataType.API_KEY,
            DataType.AUTH_TOKEN,
            DataType.PRIVATE_KEY,
            DataType.CREDIT_CARD,
            DataType.BANK_ACCOUNT
        }

        if data_type in highly_confidential_types:
            return SensitivityLevel.HIGHLY_CONFIDENTIAL
        elif data_type in confidential_types:
            return SensitivityLevel.CONFIDENTIAL
        else:
            return SensitivityLevel.INTERNAL
