from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

class Team(BaseModel):
    name: str
    players: List[str]
    captain: str
    tournament_id: str

team = APIRouter()

@team.post("/create")
def create_team(data: Team, user: dict = Depends(get_current_user)):
    if user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    captain_id=0
    cursor.execute("INSERT INTO team (name, tournament_id) VALUES (%s, %s)", (data.name, data.tournament_id))
    team_id = cursor.lastrowid
    for player in data.players:
        cursor.execute("INSERT INTO player (team_id, name) VALUES (%s, %s)", (team_id, player))
        if player == data.captain:
            captain_id = cursor.lastrowid
            cursor.execute("UPDATE team SET captain_id = %s WHERE team_id = %s", (captain_id, team_id))
    conn.commit()
    return {"message": "Team created successfully"}