import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from db import get_connection
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

class role_request(BaseModel):
    role: str
    description: str

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
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        if bcrypt.checkpw(data.password.encode("utf-8"), user["password_hash"].encode("utf-8")):
            user_data = {"email": user["email"], "id": user["user_id"], "role": user["role"]}
            token = create_token(user_data)
            return access_jwt(access_token=token)
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="login"))):
    user = decode_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id=%s", (user["id"],))
    u = cursor.fetchone()
    cursor.close()
    conn.close()
    if u['email'] == user['email']:
        return u
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="unauthorized access")


@auth.get("/verify")
def verify_user(user: dict = Depends(get_current_user)):
    return None

@auth.get("/verify_role")
def verify_role(role: str, user: dict = Depends(get_current_user)):
    if user["role"] == role:
        return None
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="unauthorized access")

@auth.post("/register")
def register(data: UserRegister):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    # first find if there is a user with same email.
    cursor.execute("SELECT * FROM users WHERE email=%s", (data.email,))
    user = cursor.fetchone()
    if user:
        cursor.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    data.password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute("INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s)", (data.email, data.password, data.name))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User registered successfully"}

@auth.post("/request_role")
def request_role(data: role_request, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("INSERT INTO role_requests (user_id, requested_role, description) VALUES (%s, %s, %s)", (user["user_id"], data.role, data.description))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Role requested"}

@auth.get("/role_requests")
def get_role_requests(status: str=None, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    if status: cursor.execute("SELECT * FROM role_requests WHERE status=%s and user_id=%s", (status, user["user_id"]))
    else: cursor.execute("SELECT * FROM role_requests WHERE user_id=%s", (user["user_id"],))
    requests = cursor.fetchall()
    for r in requests:
        if not r["admin_id"]: continue
        cursor.execute("SELECT email FROM users WHERE user_id=%s", (r["admin_id"],))
        a = cursor.fetchone()
        r["admin_email"] = a["email"]
    cursor.close()
    conn.close()
    return requests

