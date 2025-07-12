from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ContactForm, SignUp, Question,Answer, Login
from database import insert_contact_form, insert_signup_data,insert_questions,insert_answer,get_questions,insert_login_data,get_all_questions
from auth import auth_router
from fastapi import Request, Query

app = FastAPI()

# Include authentication routes
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/contact")
async def contact_form(data: ContactForm):
    return insert_contact_form(data)

@app.post("/signup")
async def signup(data: SignUp):
    return insert_signup_data(data)

@app.post("/question")
async def add_question(data: Question):
    return insert_questions(data)

@app.post("/answer")
async def add_answer(data: Answer):
    return insert_answer(data)

@app.get("/get-all-questions")
def api_get_all_questions():
    return get_all_questions()

@app.get("/login")
async def login(data: Login):
    return insert_login_data(data)