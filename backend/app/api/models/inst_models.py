from datetime import date
from pydantic import BaseModel
from typing import Optional

class InstitutionCreate(BaseModel):
    name: str
    address: str
    email: str
    class Config:
        from_attributes = True
class InstitutionUpdate(BaseModel):
    name: str
    address: str
    email: str
    class Config:
        from_attributes = True