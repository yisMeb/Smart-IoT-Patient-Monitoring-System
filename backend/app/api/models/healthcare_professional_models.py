from datetime import datetime
from pydantic import BaseModel, EmailStr

class CreateHealthcareProfessional(BaseModel):
    institution_id: str
    name: str
    specialization: str
    contact_number: str
    email: EmailStr

class FetchHealthcareProfessional(BaseModel):
    professional_id: int
    institution_id: str
    name: str
    specialization: str
    contact_number: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
