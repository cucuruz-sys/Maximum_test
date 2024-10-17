from fastapi import  HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException
from datetime import timedelta
from pydantic import BaseModel
from globals import get_all_cars


async def get_marks_and_models():
    try:
        return get_all_cars()
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
