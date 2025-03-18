from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

tournament = APIRouter()

@tournament.post("/tournaments/create")
def create_tournament(data: dict, user: dict = Depends(get_current_user)):
    if user["role"] == "organizer" or user["role"] == "manager":
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id,role FROM users WHERE email = %s", (data["manager_email"],))
        manager = cursor.fetchone()
        if not manager or manager["role"] != "manager":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Manager not found")
        cursor.execute("SELECT user_id,role FROM users WHERE email = %s", (data["organizer_email"],))
        organizer = cursor.fetchone()
        if not organizer or organizer["role"] != "organizer":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organizer not found")
        cursor.execute("INSERT INTO tournament (tournament_name, tournament_format, start_date, end_date, organizer_id, manager_id) VALUES (%s, %s, %s,%s,%s,%s)", (data["name"], data["format"], data["start_date"],data["end_date"],organizer["user_id"], manager["user_id"]))
        conn.commit()
        return {"message": "Tournament created successfully"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")

@tournament.get("/tournaments")
def get_tournaments(user: dict = Depends(get_current_user)):
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tournament")
    return cursor.fetchall()