import re
from typing import List, Dict
from app.schemas.enums import DataType
from app.schemas.raw_detection import RawDetection
from app.engine.detector.base import BaseDetector

class KeywordDetector(BaseDetector):
    def __init__(self):
        # Scan for keywords followed by assignment or helper verb, then the secret value
        # Pattern captures: group(1) -> keyword, group(2) -> value
        self.pattern = re.compile(
            r'\b(password|passwd|pwd|passcode|pin|cvv|api[-_]?key|secret[-_]?key|auth[-_]?token|access[-_]?token|bank[-_]?account|account[-_]?number|account[-_]?no|acct[-_]?num)\b'
            r'\s*(?:is|set\s+to|has\s+been|[:=])\s*'
            r'["\'`]?([a-zA-Z0-9_\-@#$%^&*()!+={}[\]|\\:;<>,.?/~`]+)["\'`]?',
            re.IGNORECASE
        )

        # Map keywords to appropriate DataType
        self.keyword_to_type: Dict[str, DataType] = {
            "password": DataType.PASSWORD,
            "passwd": DataType.PASSWORD,
            "pwd": DataType.PASSWORD,
            "passcode": DataType.PASSWORD,
            "pin": DataType.PASSWORD,
            "cvv": DataType.PASSWORD,
            "api_key": DataType.API_KEY,
            "apikey": DataType.API_KEY,
            "api-key": DataType.API_KEY,
            "secret_key": DataType.API_KEY,
            "secret-key": DataType.API_KEY,
            "token": DataType.AUTH_TOKEN,
            "auth_token": DataType.AUTH_TOKEN,
            "auth-token": DataType.AUTH_TOKEN,
            "access_token": DataType.AUTH_TOKEN,
            "access-token": DataType.AUTH_TOKEN,
            "bank_account": DataType.BANK_ACCOUNT,
            "bank-account": DataType.BANK_ACCOUNT,
            "account_number": DataType.BANK_ACCOUNT,
            "account-number": DataType.BANK_ACCOUNT,
            "account_no": DataType.BANK_ACCOUNT,
            "account-no": DataType.BANK_ACCOUNT,
            "acct_num": DataType.BANK_ACCOUNT,
            "acct-num": DataType.BANK_ACCOUNT
        }

    def detect(self, content: str) -> List[RawDetection]:
        detections: List[RawDetection] = []
        for match in self.pattern.finditer(content):
            keyword = match.group(1).lower()
            val = match.group(2)
            
            # Clean up trailing punctuation if the val was not wrapped in quotes
            # (e.g. "My password is BlueTiger123." -> "BlueTiger123")
            match_str = match.group(0)
            if not (match_str.endswith('"') or match_str.endswith("'") or match_str.endswith("`")):
                val = val.rstrip('.,!?;:')

            # Determine the start and end of the actual secret value in the content
            start_offset = match.start(2)
            end_offset = start_offset + len(val)

            # Ignore extremely short strings to prevent false positives (e.g. single letters/digits)
            if len(val) < 4:
                continue

            data_type = self.keyword_to_type.get(keyword, DataType.PASSWORD)

            detections.append(RawDetection(
                type=data_type,
                confidence=0.85 if data_type == DataType.PASSWORD else 0.80,
                start=start_offset,
                end=end_offset,
                value=val,
                detector_name="KeywordDetector"
            ))
        return detections
