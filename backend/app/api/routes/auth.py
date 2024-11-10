from fastapi import APIRouter, Depends
from firebase_admin import auth

from app.api.models.auth_models import UserLogin, UserSignup
from app.api.services.auth_services import login, signup
from app.config.database import get_db_conn


router = APIRouter()

@router.post("/signup", response_model=dict)
async def signup_endpoint(user: UserSignup, db = Depends(get_db_conn)):
    created_user = await signup(user,db)
    verification_link = auth.generate_email_verification_link(user.email)

    return {
        "user: ": created_user,
        "verification_link": verification_link,
        "email": user.email,
    }

@router.post("/login", response_model=dict)
async def login_endpoint(user: UserLogin, db = Depends(get_db_conn)):
    return await login(user, db)