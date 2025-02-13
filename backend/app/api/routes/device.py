from fastapi import APIRouter, Depends, HTTPException
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user
from app.api.models.device_models import AddDevice, UpdateDevice
from app.api.services.device_services import add_devices, read_all, update_device

router = APIRouter()

@router.post("/add", response_model=dict)
async def create_device(device: AddDevice, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await add_devices(device, db)
    else:
        raise HTTPException(status_code=401, detail="Only institution can access this feature")

@router.put("/edit/{device_id}", response_model=dict)
async def device_update(device_id: str, device: UpdateDevice, db = Depends(get_db_conn)):
    record = await update_device(device_id, device, db)
    if record is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return record


@router.get("/getAll")
async def get_all(db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution" or current_user["user_role"] == "professional":
        data = await read_all(db)
        return data
    else:
        raise HTTPException(status_code=401, detail="Only institution & professionals can access this feature")