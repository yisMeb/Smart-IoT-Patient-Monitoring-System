from uuid import UUID
from pydantic import BaseModel
from typing import Optional

class CaseData(BaseModel):
    patient_id: str
    remark: str
    professional_id : str
    


