from datetime import date
from pydantic import BaseModel
from typing import Optional

class InstitutionCreate(BaseModel):
    name: str
    address: str
    contact_number: str

class InstitutionUpdate(BaseModel):
    name: str
    address: str
    contact_number: str