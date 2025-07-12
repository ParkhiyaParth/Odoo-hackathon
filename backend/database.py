from pymongo import MongoClient
from models import ContactForm
from models import SignUp
from models import Question
from models import Answer,Login
import bcrypt
import os
from dotenv import load_dotenv
from fastapi import HTTPException, Query
from bson import ObjectId

# Load environment variables from .env file
load_dotenv()

client=MongoClient(os.getenv("MONGO_URI"))
db=client["odooDB"]  # Use DB_NAME from .env or default to "myapp"
contact_collection=db["contacts"]
# login_collection=db["login"]
signup_collection=db["sign-up"]
question_collections=db["questions"]
answer_collection=db["answers"]
login_collection=db["login"]


def insert_contact_form(data: ContactForm):
    contact_collection.insert_one(data.dict())
    return {"message": "Contact form submitted successfully."}

# def insert_login_data(data: SignUp):
#     login_collection.insert_one(data)
#     return {"message": "Login data submitted successfully."}

def insert_signup_data(data: SignUp):
    existing_user = signup_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt())

    signup_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hashed_password.decode("utf-8"),
        "role": data.role or "user"
    })

    return {"message": "Signup successful"}

def get_next_question_id():
    result = db["counters"].find_one_and_update(
        {"_id":"question_id"},
        {"$inc":{"sequence_value":1}},
        return_document=True
    )

    return f"Q{result['sequence_value']}"

def insert_questions(data:Question):
    question_id= get_next_question_id()

    question_collections.insert_one({
        "question_id": question_id,
        "title": data.title,
        "description": data.description,
        "tags": data.tags,
    })

    return {"message": "Question added successfully.", "question_id": question_id}

from bson import ObjectId

def insert_answer(data: Answer):
    try:
        obj_id = ObjectId(data.question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question ID format.")

    question = db["questions"].find_one({"_id": obj_id})
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found.")

    answer_collection.insert_one({
        "question_id": obj_id,
        "description": data.description,
        "votes": data.votes or 0,
    })

    return {"message": "Answer added successfully."}

async def get_questions():
    questions = await question_collections.find().to_list(100)
    return questions

def insert_login_data(data: Login):
    existing_user = login_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt())
    
    login_collection.insert_one({
        "email": data.email,
        "password": hashed_password,
        "role": data.role or "user"  # Default role is "user"
    })
    
    return {"message": "Login data submitted successfully."}

def get_all_questions():
    questions = []

    for q in question_collections.find():
        questions.append({
            "_id": str(q["_id"]),  # ✅ convert ObjectId to string
            "title": q["title"],
            "description": q["description"],
            "tags": q.get("tags", []),  # ✅ safe get
            "author": q.get("user_email", "Anonymous"),  # ✅ safe get
        })

    return questions

async def fetch_answers(question_id: str):
    try:
        obj_id = ObjectId(question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question ID format.")

    try:
        answers = await answer_collection.find({"question_id": obj_id}).to_list(100)
        return answers
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


def fetch_answers():
    answers = []

    for doc in answer_collection.find({}, {"description": 1, "_id": 0}):
        answers.append(doc)

    return answers