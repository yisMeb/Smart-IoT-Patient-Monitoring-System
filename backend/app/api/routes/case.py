
from fastapi import APIRouter, Depends, HTTPException
from app.api.dependacies import get_current_user
from app.config.database import get_db_conn
from app.api.models.case_model import CaseData
from app.api.services.case_services import add_case_history, get_case_history


router = APIRouter()

@router.post("/remark/patient/{patient_id}/{professional_id}/{remark}")
async def addcase(patient_id:str, professional_id:str, remark:str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional":
        return await add_case_history(patient_id, professional_id, remark, db)
    else:
        raise HTTPException(status_code=401, detail="Only professionals can access this feature.")


@router.get("/remark/patient/{id}")
async def getcase(id: str ,db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "professional" or current_user["user_role"] == "patient":
        return await get_case_history(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only professional or patient can access this feature.")


