

from fastapi import APIRouter, Depends, HTTPException

from app.api.dependacies import get_current_user
from app.api.services.alert_services import fetch_notifications_by_id, fetch_notifications_by_proffesional
from app.config.database import get_db_conn
from app.api.models.case_model import CaseData
from app.api.services.case_services import add_case_history, get_case_history


router = APIRouter()

@router.post("/remark/patient")
async def addcase(data: CaseData,db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    # Get id from token and pass that
    if current_user["user_role"] == "professional":
        print(data)
        return await add_case_history (data, db)
    else:
        raise HTTPException(status_code=401, detail="Only professionals can access this feature.")


@router.get("/remark/patient/{id}")
async def getcase(id: str ,db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    # Get id from token and pass that
    if current_user["user_role"] == "professional":
        return await get_case_history(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only professional can access this feature.")


