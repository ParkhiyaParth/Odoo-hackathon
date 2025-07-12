from fastapi import APIRouter, HTTPException, Depends
from models import Login
from database import signup_collection
from database import question_collections
import os
import bcrypt
from bson import ObjectId

auth_router = APIRouter()

@auth_router.post("/login")
async def login(data: Login):
    user = signup_collection.find_one({
        "email": data.email,
    })

    if user and bcrypt.checkpw(data.password.encode("utf-8"),user["password"].encode("utf-8")):
        return {
            "message": "Login successful",
            "user": {
                "email": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

@auth_router.get("/admin")
async def get_admin_dashboard(email:str):
    user = signup_collection.find_one({
        "email":email
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("role")!="admin":
        raise HTTPException(status_code=403, detail="Access denied. Admins only.")
    
    return {
        "message": "Welcome to the admin dashboard",
        "admin": {
            user["name"]
        }
    }



@auth_router.get("/admin/questions")
async def get_all_questions():
    questions=await question_collections.find().to_list(100)
    return questions

@auth_router.get("/admin/remove-question/{id}")
async def remove_question(id: str):
    await question_collections.delete_one({"_id":ObjectId(id)})