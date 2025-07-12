from fastapi import APIRouter, HTTPException
from models import Login
from database import signup_collection

auth_router = APIRouter()

@auth_router.post("/login")
async def login(data: Login):
    user = signup_collection.find_one({
        "email": data.email,
        "password": data.password
    })

    if user:
        return {"message": "Login successful", "user": {"email": user["email"], "name": user["name"]}}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")
