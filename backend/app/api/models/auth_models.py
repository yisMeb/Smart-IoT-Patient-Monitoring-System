from datetime import date
from pydantic import BaseModel
from typing import Optional

class UserSignup(BaseModel):
    email: str
    password: str
    created_at: date
    role: str
    phone_number: str
    given_name: str
    family_name: str
    address: str

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
    phone_number: str
    given_name: str
    family_name: str
    address: str
    role: str
    created_at: date

class FetchUser(UserBase):
    group_name: str
    email:str
    created_at: date

    class Config:
        from_attributes = True