from datetime import date
from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class PatientCreate(BaseModel):
    institution_id: str
    name: str
    dob: date
    contact_number: Optional[str]
    email: str
    status: str
    address: Optional[str]  
    device_id: UUID
    oxygen_threshold: float
    heartrate_threshold: float
    temperature_threshold: float
    oxygen_threshold_lower: float
    heartrate_threshold_lower: float
    temperature_threshold_lower: float
    professional_id: str
    class Config:
        from_attributes = True


class PatientUpdate(BaseModel):
    name: str
    dob: date
    contact_number: str
    email: str
    address: str
    status: str
    device_id: UUID
    professional_id: str
    class Config:
        from_attributes = True

class PatientUpdateThreshold(BaseModel):
    heartrate_threshold_lower: float | None = None
    heartrate_threshold: float | None = None
    oxygen_threshold_lower: float | None = None
    oxygen_threshold: float | None = None
    temperature_threshold_lower: float | None = None
    temperature_threshold: float | None = None

    class Config:
        from_attributes = True