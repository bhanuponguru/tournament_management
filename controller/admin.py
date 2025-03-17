from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from auth import get_current_user

admin = APIRouter()

@admin.get("/users")
def get_users(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    return cursor.fetchall()

@admin.get("/users/{user_id}")
def get_user(user_id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    return cursor.fetchone()


