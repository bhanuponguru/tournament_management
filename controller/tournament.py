from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

tournament = APIRouter()

class team(BaseModel):
    name: str
    members: List[str]

class tournament(BaseModel):
    name: str
    format: str
    start_date: date
    end_date: date
    teams: List[team]

@tournament.post("/create")
def create_tournament(data: tournament, user: dict = Depends(get_current_user)):
    if user["role"] != "organizer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    cursor.execute("INSERT INTO tournaments (name, format, start_date, end_date, organizer_id) VALUES (%s, %s, %s, %s, %s)", (data.name, data.format, data.start_date, data.end_date, user["id"]))
    tournament_id = cursor.lastrowid
    for team in data.teams:
        cursor.execute("INSERT INTO teams (name, tournament_id) VALUES (%s, %s)", (team.name, tournament_id))
        team_id = cursor.lastrowid
        for member in team.members:
            cursor.execute("INSERT INTO players (team_id, ) VALUES (%s, %s)", (team_id, member))
