from datetime import datetime, timezone
import uuid
import asyncpg
from fastapi import HTTPException
from app.api.models.auth_models import UserLogin, UserSignup
from app.api.models.other_models import validate_input, validate_phone_number
from firebase_admin import auth, credentials, initialize_app


async def signup(user: UserSignup, db: asyncpg.Connection):
    
    user_data = {
            "email": user.email,
            "u_role": user.role, 
            "phone_number": user.phone_number, 
            "given_name": user.given_name, 
            "family_name": user.family_name, 
            "address": user.address, 
        }
    validate_input(user_data) 
    validate_phone_number(user.phone_number)
    try:
        # Step 1: Create user in Firebase Auth
        firebase_user = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=f"{user.given_name} {user.family_name}",
            phone_number=user.phone_number
        )
        # Step 2: insert user data into PostgreSQL
        await save_user_to_db(db, user_data)
        return {
            "message": "User created successfully.",
            "user_uid": firebase_user.uid
        }
    except Exception as e:
        try:
            # remove the user from Firebase if creation fails
            if 'firebase_user' in locals():
                await auth.delete_user(firebase_user.uid)
        except Exception as deletion_error:
            # Log the deletion error if needed, but do not raise it to avoid masking the original exception
            print(f"Failed to delete Firebase user: {str(deletion_error)}")
        
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

async def login(user: UserLogin, db: asyncpg.Connection):
    verification_status = await check_user_verification(user.email)
    try:
        # Firebase Admin SDK does not support client-side login, so we use custom tokens here.
        firebase_user = auth.get_user_by_email(user.email)
        # You would validate the password on the client side and then create a custom token for the session
        custom_token = auth.create_custom_token(firebase_user.uid)
        
        # Fetch user data from PostgreSQL
        user_data = await fetch_user_by_email(user.email, db)
        minimal_user_data = {
            "user_id": user_data["user_id"],
            "email": user_data["email"],
            "given_name": user_data["given_name"],
            "family_name": user_data["family_name"],
            "group_name": user_data["group_name"],
            "company_id":user_data["company_id"],
        }
        return {
            "message": "User logged in successfully.",
            "custom_token": custom_token.decode("utf-8"),
            "user_data": minimal_user_data,
            "verification_status":verification_status 
        }
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred: " + str(e))

async def check_user_verification(email: str):
    try:
        user = auth.get_user_by_email(email)
        if not user.email_verified:
            return False
        return True
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")


async def save_user_to_db(db: asyncpg.Connection, user_data: dict):
    current_date = datetime.now(timezone.utc).replace(tzinfo=None)
    """ 
            "email": user.email,
            "u_role": user.role, 
            "phone_number": user.phone_number, 
            "given_name": user.given_name, 
            "family_name": user.family_name, 
            "address": user.address, 
    """
    try:
        await db.execute('''
            INSERT INTO public."users"(email, u_role, phone_number, given_name, family_name, address, created_at)
            VALUES($1, $2, $3, $4, $5, $6, $7)
        ''', user_data['email'], user_data['u_role'], user_data['phone_number'], user_data['given_name'], user_data['family_name'], user_data['address'], current_date
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insertion error: {str(e)}")

async def fetch_user_by_email(email: str, db: asyncpg.Connection):
    try:
        user = await db.fetchrow('''
            SELECT * FROM public."users" WHERE email = $1
        ''', email)

        if user is None:
            raise HTTPException(status_code=404, detail="User not found.")

        return dict(user)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
