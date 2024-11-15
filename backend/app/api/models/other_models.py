import re
from fastapi import HTTPException
import phonenumbers

def validate_input(user_data: dict):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, user_data['email']):
        raise HTTPException(status_code=400, detail="Invalid email format.")
    if not user_data.get('address'):
        raise HTTPException(status_code=400, detail="Address cannot be empty.")
    if not user_data.get('name'):
            raise HTTPException(status_code=400, detail="given name cannot be empty.")

def validate_phone_number(phone_number: str) -> str:
    try:
        parsed_number = phonenumbers.parse(phone_number, None)
        if not phonenumbers.is_valid_number(parsed_number):
            raise ValueError("Invalid phone number")
        return phonenumbers.format_number(parsed_number, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException:
        raise ValueError("Invalid phone number format")
