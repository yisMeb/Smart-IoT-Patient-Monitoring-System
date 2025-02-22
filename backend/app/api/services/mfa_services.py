import base64
import time
import pyotp
import asyncpg
from fastapi import HTTPException
from app.api.services.auth_services import fetch_user_by_email
import pyqrcode
import io

async def enable_mfa(email: str, db: asyncpg.Connection):
    try:
        await fetch_user_by_email(email, db)
        
        totp_secret = pyotp.random_base32()
        
        totp = pyotp.TOTP(
            totp_secret,
            interval=30,  # Standard time step
            digits=6     # Standard digits length
        )
        
        otp_url = totp.provisioning_uri(
            name=email, 
            issuer_name="TENA GUEARD"
        )

        await db.execute(
            "INSERT INTO user_mfa (email, totp_secret) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET totp_secret = EXCLUDED.totp_secret",
            email, totp_secret
        )

        qr = pyqrcode.create(otp_url)
        buf = io.BytesIO()
        qr.png(buf, scale=6) 
        buf.seek(0)

        base64_qr = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {
                    "message": "MFA enabled successfully",
                    "qr_code_base64": base64_qr
                }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enabling MFA: {str(e)}")

async def verify_mfa(email: str, code: str, db: asyncpg.Connection):
    try:
        result = await db.fetchrow("SELECT totp_secret FROM user_mfa WHERE email = $1", email)

        if not result:
            raise HTTPException(status_code=400, detail="MFA not enabled for this user")

        totp_secret = result["totp_secret"]
        totp = pyotp.TOTP(totp_secret)

        # Get current and adjacent time windows
        current_time = int(time.time())
        time_window = 30  # TOTP default window size
        current_window = current_time // time_window
        
        # Print debug information for multiple windows
        for offset in [-1, 0, 1]:
            window_time = (current_window + offset) * time_window
            temp_totp = pyotp.TOTP(totp_secret)
            print(f"DEBUG: Window {offset}: Time={window_time}, Code={temp_totp.at(window_time)}")

        print(f"DEBUG: TOTP Secret = {totp_secret}")
        print(f"DEBUG: User Entered Code = {code}")
        print(f"DEBUG: Current UNIX Timestamp = {current_time}")

        # Increase valid_window to check adjacent time windows
        if not totp.verify(code, valid_window=2):  # Check current and 2 windows before/after
            raise HTTPException(status_code=400, detail="Invalid MFA code")

        return {"message": "MFA verified successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying MFA: {str(e)}")
    
async def disable_mfa(email: str, db: asyncpg.Connection):
    try:
        await db.fetchrow("DELETE from user_mfa WHERE email = $1", email)
        return {"message": "MFA Disableed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying MFA: {str(e)}")
