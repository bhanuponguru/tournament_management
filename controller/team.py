from fastapi import APIRouter, Depends, HTTPException, status
from db import conn
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

class team:
    name: str
    players: List[str]
    captain: str

@team.post("/create")
def create_team(data: team, user: dict = Depends(get_current_user)):
    if user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    cursor = conn.cursor(dictionary=True)
    captain_id=0
    team_id = cursor.lastrowid
    for player in data.players:
        cursor.execute("INSERT INTO players (team_id, player_id) VALUES (%s, %s)", (team_id, player))
        if player == data.captain:
            captain_id = cursor.lastrowid
    cursor.execute("INSERT INTO teams (name, manager_id, captain_id) VALUES (%s, %s, %s)", (data.name, user["id"], captain_id))
    conn.commit()
    return {"message": "Team created successfully"}