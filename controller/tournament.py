from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

tournament = APIRouter()

@tournament.post("/create")
def create_tournament(data: dict, user: dict = Depends(get_current_user)):
    if user["role"] != "organizer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("INSERT INTO tournaments (name, format, start_date, end_date, organizer_id, manager_id) VALUES (%s, %s, %s)", (data["name"], data["format"], data["start_date"], data["end_date"], user["id"], data["manager_id"]))
    conn.commit()
    return {"message": "Tournament created successfully"}