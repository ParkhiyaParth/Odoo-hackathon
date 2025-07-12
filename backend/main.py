from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ContactForm, SignUp
from database import insert_contact_form, insert_signup_data
from auth import auth_router

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
