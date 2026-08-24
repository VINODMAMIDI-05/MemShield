from pydantic import BaseModel
from app.schemas.enums import DataType

class RawDetection(BaseModel):
    type: DataType
    confidence: float
    start: int
    end: int
    value: str
    detector_name: str
