from fastapi import  HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException
from datetime import timedelta
from pydantic import BaseModel
from globals import get_cars_from_db
from bson.objectid import ObjectId

class DialogIdRequest(BaseModel):
    model: str
    mark: str

def serialize_objectid(data):
    if isinstance(data, list):
        return [serialize_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: str(value) if isinstance(value, ObjectId) else serialize_objectid(value) for key, value in data.items()}
    else:
        return data


async def get_cars(request_body: DialogIdRequest = Body(...)):
    model = request_body.model
    mark = request_body.mark
    try:
        cars = get_cars_from_db(model,mark)
        return serialize_objectid(cars)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
