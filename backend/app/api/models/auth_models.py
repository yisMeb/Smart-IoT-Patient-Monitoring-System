from datetime import date
from pydantic import BaseModel
from typing import Optional

class InstituteSignup(BaseModel):
    email: str
    password: str
    name: str
    address: str
class InstituteUpdate(BaseModel):
    name: str
    address: str
    email: str
    
class UserLogin(BaseModel):
    email: str  
    password: str

class EditUser(BaseModel):
    phone_number: str
    given_name: str
    family_name: str
    address: str

class CreateUser(BaseModel): # for admins
    email: str
    password: str
    phone_number: str
    given_name: str
    family_name: str
    created_at: date
    address: Optional[str] 
    role: str

class UserBase(BaseModel):
    email: str
    password: str
    phone_number: str
    given_name: str
    family_name: str
    created_at: date
    address: Optional[str] 
    role: str

class FetchUser(UserBase):
    user_id: str
    email:str
    created_at: date
    role_id: str
    institution_id: Optional[str]
    professional_id: Optional[str]
    patient_id: Optional[str]

    class Config:
        from_attributes = True