from fastapi import APIRouter, Depends, HTTPException, status
from db import get_connection
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

class Team(BaseModel):
    name: str
    tournament_id: str

team = APIRouter()

@team.post("/create")
def create_team(data: Team, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("INSERT INTO team (name, tournament_id) VALUES (%s, %s)", (data.name, data.tournament_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Team created successfully"}


@team.get("/")
def get_teams(tournament_id: int = None, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    if tournament_id:
        cursor.execute("SELECT * FROM team WHERE tournament_id = %s", (tournament_id,))
    else:
        cursor.execute("SELECT * FROM team")
    teams = cursor.fetchall()
    cursor.close()
    conn.close()
    return teams

@team.get('/players')
def get_players(team_id: int, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM player WHERE team_id = %s", (team_id,))
    players = cursor.fetchall()
    cursor.close()
    conn.close()
    return players

@team.get('/get_team')
def get_team(team_id: int, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM team WHERE team_id = %s", (team_id,))
    team = cursor.fetchone()
    cursor.close()
    conn.close()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


