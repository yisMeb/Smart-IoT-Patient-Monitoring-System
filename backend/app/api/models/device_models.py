from uuid import UUID
from pydantic import BaseModel

class AddDevice(BaseModel):
    device_name: str
    is_assigned: bool
    assigned_to: str
    class Config:
        from_attributes = True

class UpdateDevice(BaseModel):
    device_name: str | None = None
    is_assigned: bool | None = None
    assigned_to: str | None = None
    class Config:
        from_attributes = True