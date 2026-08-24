import re
from typing import List, Dict
from app.schemas.enums import DataType
from app.schemas.raw_detection import RawDetection
from app.engine.detector.base import BaseDetector

class RegexDetector(BaseDetector):
    def __init__(self):
        self.patterns: Dict[DataType, re.Pattern] = {
            DataType.EMAIL: re.compile(
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            ),
            # Supports US (3-3-4), Indian (5-5), and consecutive 10-digit phone formats with country codes
            DataType.PHONE: re.compile(
                r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|'
                r'\b(?:\+?\d{1,3}[-.\s]?)?\d{5}[-.\s]?\d{5}\b|'
                r'\b(?:\+?\d{1,3}[-.\s]?)?\d{10}\b'
            ),
            # Indian Aadhaar: XXXX XXXX XXXX or XXXXXXXXXXXX
            DataType.AADHAAR: re.compile(
                r'\b\d{4}\s\d{4}\s\d{4}\b|\b\d{12}\b'
            ),
            # Indian PAN: 5 letters, 4 digits, 1 letter
            DataType.PAN: re.compile(
                r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', re.IGNORECASE
            ),
            # Credit Card: 13-19 digits, spaces/hyphens allowed
            DataType.CREDIT_CARD: re.compile(
                r'\b(?:\d[ -]*?){13,19}\b'
            ),
            # Common API Key structures (OpenAI, Stripe, Generic)
            DataType.API_KEY: re.compile(
                r'\b(?:sk-[a-zA-Z0-9]{20,48}|sk-proj-[a-zA-Z0-9_\-]{48,}|sk_live_[0-9a-zA-Z]{24})\b'
            ),
            # JWT Token pattern
            DataType.AUTH_TOKEN: re.compile(
                r'\beyJhbGciOi[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b'
            ),
            # Private keys
            DataType.PRIVATE_KEY: re.compile(
                r'-----BEGIN[ A-Z]*?PRIVATE KEY-----[\s\S]+?-----END[ A-Z]*?PRIVATE KEY-----', re.IGNORECASE
            )
        }

    def _luhn_check(self, card_num: str) -> bool:
        """
        Validate card number using Luhn algorithm.
        """
        digits = [int(d) for d in re.sub(r'\D', '', card_num)]
        if not digits or len(digits) < 13 or len(digits) > 19:
            return False
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        total = sum(odd_digits)
        for d in even_digits:
            double = d * 2
            total += double if double < 10 else double - 9
        return total % 10 == 0

    def detect(self, content: str) -> List[RawDetection]:
        detections: List[RawDetection] = []
        for data_type, pattern in self.patterns.items():
            for match in pattern.finditer(content):
                val = match.group(0)
                start, end = match.span()

                # Perform Luhn check verification for Credit Cards
                if data_type == DataType.CREDIT_CARD:
                    if not self._luhn_check(val):
                        continue

                detections.append(RawDetection(
                    type=data_type,
                    confidence=0.99 if data_type != DataType.PHONE else 0.95,
                    start=start,
                    end=end,
                    value=val,
                    detector_name="RegexDetector"
                ))
        return detections
