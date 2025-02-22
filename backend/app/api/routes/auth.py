import asyncpg
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth
from app.api.models.auth_models import InstituteSignup, UserLogin
from app.api.services.auth_services import fetch_Institution_by_id, fetch_user_by_email, is_user_locked, login, reset_failed_attempts, signupInstitute, track_failed_attempt
from app.config.database import get_db_conn
from app.api.dependacies import get_current_user


router = APIRouter()

@router.post("/signup/ins", response_model=dict)
async def signup_institute(user: InstituteSignup, db = Depends(get_db_conn)):
    created_user = await signupInstitute(user,db)
    verification_link = auth.generate_email_verification_link(user.email)

    return {
        "user: ": created_user,
        "verification_link": verification_link,
        "email": user.email,
    }

@router.post("/login", response_model=dict)
async def login_endpoint(user: UserLogin, db = Depends(get_db_conn)):
    return await login(user, db)

@router.get("/fetchInst/{id}")
async def fetch_institution(id: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user["user_role"] == "institution":
        return await fetch_Institution_by_id(id, db)
    else:
        raise HTTPException(status_code=401, detail="Only institution users can access this feature.")

@router.get("/fecthUser/{email}")
async def fetch_User(email: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    user_data = await fetch_user_by_email(email, db)
    if user_data["institution_id"] is not None:
        user_role = "institution"
    elif user_data["professional_id"] is not None:
        user_role = "professional"
    elif user_data["patient_id"] is not None:
        user_role = "patient"
    else:
        raise HTTPException(status_code=400, detail="User role not identified.")
    return{
        "user_data": user_data,
        "user_role": user_role
    }


@router.post("/track-failed-login/{email}")
async def track_failed_login(email: str, db: asyncpg.Connection = Depends(get_db_conn)):
    """Track a failed login attempt."""
    await track_failed_attempt(email, db)
    return {"message": "Failed attempt tracked."}

@router.post("/reset-failed-login/{email}")
async def reset_failed_login(email: str, db: asyncpg.Connection = Depends(get_db_conn)):
    """Reset failed login attempts."""
    await reset_failed_attempts(email, db)
    return {"message": "Failed attempts reset."}

@router.get("/is-locked/{email}")
async def check_lock_status(email: str, db: asyncpg.Connection = Depends(get_db_conn)):
    """Check if the user is locked."""
    await is_user_locked(email, db)
    return {"message": "User is not locked."}