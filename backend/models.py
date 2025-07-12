## For Creating a database model for a contact form submission
# This code defines a Pydantic model for a contact form submission, which includes fields for

from pydantic import BaseModel, EmailStr

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class SignUp(BaseModel):
    name: str
    email: EmailStr
    password: str

class Login(BaseModel):
    email: EmailStr
    password: str    

