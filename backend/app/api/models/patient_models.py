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

