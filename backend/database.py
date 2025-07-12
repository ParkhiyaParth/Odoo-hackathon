from pymongo import MongoClient
from models import ContactForm
from models import SignUp
# from models import Login
import os
from dotenv import load_dotenv
from fastapi import HTTPException

# Load environment variables from .env file
load_dotenv()

client=MongoClient(os.getenv("MONGO_URI"))
db=client["odooDB"]  # Use DB_NAME from .env or default to "myapp"
contact_collection=db["contacts"]
# login_collection=db["login"]
signup_collection=db["sign-up"]

def insert_contact_form(data: ContactForm):
    contact_collection.insert_one(data.dict())
    return {"message": "Contact form submitted successfully."}

# def insert_login_data(data: SignUp):
#     login_collection.insert_one(data)
#     return {"message": "Login data submitted successfully."}

def insert_signup_data(data: SignUp):
    # Check if the email already exists
    existing_user = signup_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    signup_collection.insert_one(data.dict())
    return {"message": "Signup data submitted successfully."}
