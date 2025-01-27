from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class AddHealthData(BaseModel):
    heartrate: Optional[float]
    oxygen: Optional[float]
    temprature: Optional[float]
    device_id: str
    class Config:
        from_attributes = True


