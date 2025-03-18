import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db import conn
from pydantic import BaseModel
from typing import Optional
auth = APIRouter()

class User(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class access_jwt(BaseModel):
    access_token: str
    token_type: Optional[str] = "bearer"

load_dotenv()

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=30)
    token = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

def decode_token(token):
    try:
        decoded_token = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
@auth.post("/login", response_model=access_jwt)
def login(data: User):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (data.email, data.password))
    user = cursor.fetchone()
    cursor.close()
    if user:
        user_data = {
            "id": user["user_id"],
            "email": user["email"]
        }
        token = create_token(user_data)
        return access_jwt(access_token=token)
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="login"))):
    user = decode_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user["id"],))
    u = cursor.fetchone()
    cursor.close()
    if u['email'] == user['email']:
        return u
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="unauthorized access")


@auth.get("/users/current")
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@auth.post("/register")
def register(data: UserRegister):
    cursor = conn.cursor(dictionary=True)
    # first find if there is a user with same email.
    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()
    if user:
        cursor.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    cursor.execute("INSERT INTO users (email, password, name) VALUES (%s, %s, %s)", (data.email, data.password, data.name))
    conn.commit()
    cursor.close()
    return {"message": "User registered successfully"}

