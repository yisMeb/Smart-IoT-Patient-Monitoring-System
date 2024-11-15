from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth

from app.api.models.auth_models import FetchUser, InstituteSignup, UserLogin
from app.api.services.auth_services import fetch_user_by_email, login, signupInstitute
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


@router.get("/fecthUser/{email}")
async def fetch_User(email: str, db = Depends(get_db_conn), current_user: dict = Depends(get_current_user)):
    if current_user['user_role'] != 'admin':
        raise HTTPException(status_code=403, detail="You do not have permission to perform this action")
    
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
