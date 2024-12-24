from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class AddHealthData(BaseModel):
    heartrate: Optional[float]
    oxygen: Optional[float]
    temprature: Optional[float]
    device_id: UUID
    class Config:
        from_attributes = True


