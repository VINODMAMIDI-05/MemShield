from abc import ABC, abstractmethod
from typing import List
from app.schemas.raw_detection import RawDetection

class BaseDetector(ABC):
    @abstractmethod
    def detect(self, content: str) -> List[RawDetection]:
        """
        Scan content and return list of raw detections.
        """
        pass
