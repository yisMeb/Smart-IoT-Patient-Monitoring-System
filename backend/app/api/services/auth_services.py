from datetime import datetime, timezone
import logging
import asyncpg
from fastapi import HTTPException
from app.api.models.auth_models import InstituteSignup, InstituteUpdate, UserLogin
from app.api.models.other_models import validate_input
from firebase_admin import auth

async def signupInstitute(user: InstituteSignup, db: asyncpg.Connection):
    Urole = "Institution"
    user_data = {
        "name": user.name,
        "address": user.address,
        "email": user.email,
    }
    validate_input(user_data)
    
    try:
        try:
            existing_user = auth.get_user_by_email(user.email)
            if existing_user: 
                raise HTTPException(status_code=400, detail={"message": "User already exists with this email."})
        except auth.UserNotFoundError:
            pass

        firebase_user = auth.create_user( 
            email=user.email,
            password=user.password,
            display_name=user.name,
        )
        i_id = await save_Institution_to_db(db, user_data)
        if i_id is None:
            raise HTTPException(status_code=500, detail={"message": "Failed to add user to the database."})
        assignment_id, role_id = await asign_role(db, i_id, Urole)
        if assignment_id is None or role_id is None:
            raise HTTPException(status_code=500, detail={"message": "Role creation failed."})
        
        await add_users(db, email=user.email, role_id=role_id, institution_id=i_id)

        return {
            "message": "User created successfully.",
            "user_uid": firebase_user.uid
        }
    except HTTPException as http_ex:
        print(f"Error in registration : {str(http_ex)}")
        raise http_ex
    except Exception as e:
        try:
            if 'firebase_user' in locals():
                await auth.delete_user(firebase_user.uid)
        except Exception as deletion_error:
            print(f"Failed to delete Firebase user: {str(deletion_error)}")
        raise HTTPException(status_code=500, detail={"message": f"Failed to create user: {str(e)}"})

async def login(user: UserLogin, db: asyncpg.Connection):
    verification_status = await check_user_verification(user.email)
    try:
        firebase_user = auth.get_user_by_email(user.email)
        custom_token = auth.create_custom_token(firebase_user.uid)
        
        user_data = await fetch_user_by_email(user.email, db)
        if user_data["institution_id"] is not None:
            user_role = "institution"
            role_specific_id = user_data["institution_id"]
        elif user_data["professional_id"] is not None:
            user_role = "professional"
            role_specific_id = user_data["professional_id"]
        elif user_data["patient_id"] is not None:
            user_role = "patient"
            role_specific_id = user_data["patient_id"]
        else:
            raise HTTPException(status_code=400, detail="User role not identified.")
        
        minimal_user_data = {
            "user_id": user_data["user_id"],
            "email": user_data["email"],
            "role_id": user_data["role_id"],
            "user_role": user_role,
            "role_specific_id": role_specific_id
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

async def add_users(db:asyncpg.Connection, email: str, role_id: str, institution_id: str = None, professional_id: str = None, patient_id: str = None):
    current_date = datetime.now(timezone.utc).replace(tzinfo=None)
    
    if institution_id is not None:
        column = "institution_id"
        value = institution_id
    elif professional_id is not None:
        column = "professional_id"
        value = professional_id
    elif patient_id is not None:
        column = "patient_id"
        value = patient_id
    else:
        raise HTTPException(status_code=400, detail="No valid ID provided for institution, professional, or patient.")

    try:
        # Construct and execute the query dynamically
        query = f'''
            INSERT INTO public."users"(email, created_at, role_id, {column})
            VALUES($1, $2, $3, $4)
            RETURNING user_id
        '''
        user_id = await db.fetchval(
            query,
            email,
            current_date,
            role_id,
            value,
        )
        return user_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User creation error: {str(e)}")
    

async def asign_role(db:asyncpg.Connection, u_id: str, u_role: str):
    current_date = datetime.now(timezone.utc).replace(tzinfo=None)
    try:
        role = await db.fetchrow('''
            SELECT role_id FROM public."user_roles" WHERE role_name = $1
        ''', u_role)
        if role is None:
            raise HTTPException(status_code=404, detail=f"No role found: {str(e)}")
        
        role_id = str(role['role_id'])
        
        assignment_id = await db.fetchval('''
            INSERT INTO public."user_role_assignments"(user_id, role_id, created_at)
            VALUES($1, $2, $3)
            RETURNING assignment_id
        ''', u_id, role_id, current_date)
        
        return assignment_id, role_id
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Role insertion error: {str(e)}")
    
    
async def save_Institution_to_db(db: asyncpg.Connection, user_data: dict):
    current_date = datetime.now(timezone.utc).replace(tzinfo=None)
    try:
        institution_id = await db.fetchval('''
            INSERT INTO public."institutions"(name, address, email, created_at)
            VALUES($1, $2, $3, $4)
            RETURNING institution_id
        ''', user_data['name'], user_data['address'], user_data['email'], current_date)
        
        return institution_id
     
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Institute creation error: {str(e)}")
    
async def fetch_user_by_email(email: str, db: asyncpg.Connection):
    logger = logging.getLogger(__name__)
    try:
        user = await db.fetchrow('''
            SELECT * FROM public."users" WHERE email = $1
        ''', email)
        logger.error(f"Email is : {email}")
        if user is None:
            raise HTTPException(status_code=404, detail="User not found.")

        return dict(user)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

async def fetch_Institution_by_id(id: str, db: asyncpg.Connection):
    try:
        user = await db.fetchrow('''
            SELECT * FROM public."institutions" WHERE institution_id = $1
        ''', id)
        if user is None:
            raise HTTPException(status_code=404, detail="institutions not found.")

        return dict(user)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
async def update_institutes(db: asyncpg.Connection, id: str, updates: InstituteUpdate):
    await fetch_Institution_by_id(id, db) #check if the user exists
    try:
        await db.execute('''
            UPDATE public."institutions"
            SET name = $1, address = $2, email = $3
            WHERE institution_id = $4
        ''', updates.name, updates.address, updates.email, id)

        return {"message": "Institution updated successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    