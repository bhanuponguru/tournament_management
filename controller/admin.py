from fastapi import APIRouter, Depends, HTTPException, status
from db import get_connection
from pydantic import BaseModel
from auth import get_current_user

class request(BaseModel):
    request_id: int

admin = APIRouter()

@admin.get("/users")
def get_users(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users=cursor.fetchall()
    cursor.close()
    conn.close()
    return users

@admin.get("/users/{user_id}")
def get_user(user_id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn =get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@admin.get("/role_requests")
def get_role_requests(status: str = None, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    if status:
        if status ==  'pending': cursor.execute("SELECT * FROM role_requests WHERE status=%s", (status,))
        else: cursor.execute("SELECT * FROM role_requests WHERE status=%s and admin_id=%s", (status, user["user_id"]))
    else:
        cursor.execute("SELECT * FROM role_requests where status = 'pending' or admin_id=%s or user_id=%s", (user["user_id"], user["user_id"]))
    requests = cursor.fetchall()
    cursor.close()
    conn.close()
    return requests

@admin.put("/role_requests/approve")
def approve_role_request(data: request, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM role_requests WHERE request_id=%s", (data.request_id,))
    request = cursor.fetchone()
    if not request:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Request not found")
    cursor.execute("UPDATE role_requests SET status='approved', admin_id=%s WHERE request_id=%s", (user['user_id'], data.request_id,))
    cursor.execute("UPDATE users SET role=%s WHERE user_id=%s", (request["requested_role"], request["user_id"]))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Request approved"}

@admin.put("/role_requests/decline")
def decline_role_request(data: request, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM role_requests WHERE request_id=%s", (data.request_id,))
    request = cursor.fetchone()
    if not request:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Request not found")
    cursor.execute("UPDATE role_requests SET status='declined', admin_id = %s WHERE request_id=%s", (user['user_id'], data.request_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Request declined"}

