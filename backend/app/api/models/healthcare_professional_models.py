from datetime import datetime
from pydantic import BaseModel, EmailStr

class CreateHealthcareProfessional(BaseModel):
    institution_id: str
    name: str
    specialization: str
    contact_number: str
    email: EmailStr

class FetchHealthcareProfessional(BaseModel):
    professional_id: str
    institution_id: str
    name: str
    specialization: str
    contact_number: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True



class UpdateHealthcareProfessional(BaseModel):
    name: str | None = None
    specialization: str | None = None
    contact_number: str | None = None
    email: EmailStr | None = None