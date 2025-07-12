## For Creating a database model for a contact form submission
# This code defines a Pydantic model for a contact form submission, which includes fields for

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class SignUp(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"

class Login(BaseModel):
    email: EmailStr
    password: str    
    role: Optional[str] = "user"

class Question(BaseModel):
    title: str
    description: str
    tags: List[str]
    user_email: EmailStr

class Answer(BaseModel):
    question_id: str
    description: str
    votes: Optional[int] = 0

class TokenData(BaseModel):
    user_id: int

class Notification(BaseModel):
    user_email: str
