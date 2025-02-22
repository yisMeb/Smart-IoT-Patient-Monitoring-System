from fastapi import APIRouter, Depends
import asyncpg

from app.config.database import get_db_conn
from ..services.mfa_services import disable_mfa, enable_mfa, verify_mfa

router = APIRouter()

@router.post("/enable-mfa/{email}")
async def enable_mfa_route(email: str, db: asyncpg.Connection = Depends(get_db_conn)):
    return await enable_mfa(email, db)

@router.post("/disable-mfa/{email}")
async def disable_mfa_route(email: str, db: asyncpg.Connection = Depends(get_db_conn)):
    return await disable_mfa(email, db)

@router.post("/verify-mfa/{email}/{code}")
async def verify_mfa_route(email: str, code: str, db: asyncpg.Connection = Depends(get_db_conn)):
    if not email or not code:
        return {"error": "Email and code are required"}

    return await verify_mfa(email, code, db)

