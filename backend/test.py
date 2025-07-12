from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["Project_DB"]  # Use DB_NAME from .env or default to "myapp"
collection = db["contacts"]
login_collection = db["login"]
signup_collection = db["signup"]

data = {
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Hello",
    "message": "Testing from script"
}
data_login ={
    "email": "test@gmail.com",
    "password": "test123"
}
data_signup = {
    "name": "Test Signup",
    "email": "test@gmail.com",
    "password": "signup123"
}

# collection.insert_one(data)
login_collection.insert_one(data_login)
signup_collection.insert_one(data_signup)
print("Inserted")


