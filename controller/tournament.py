from fastapi import APIRouter, Depends, HTTPException, status
from db import get_connection
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from auth import get_current_user

tournament = APIRouter()

@tournament.post("/create")
def create_tournament(data: dict, user: dict = Depends(get_current_user)):
    if user["role"] == "organizer" or user["role"] == "manager":
        conn = get_connection()
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
        cursor.close()
        conn.close()
        return {"message": "Tournament created successfully"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")

@tournament.get("/")
def get_tournaments(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    if user["role"] == "organizer":
        cursor.execute("SELECT * FROM tournament WHERE organizer_id = %s", (user["user_id"],))
    elif user["role"] == "manager":
        cursor.execute("SELECT * FROM tournament WHERE manager_id = %s", (user["user_id"],))
    else:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    tournaments = cursor.fetchall()
    cursor.close()
    conn.close()
    return tournaments

@tournament.get("/all")
def get_all_tournaments(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tournament")
    tournaments = cursor.fetchall()
    cursor.close()
    conn.close()
    return tournaments

@tournament.get("/players")
def get_players_in_tournament(tournament_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = %s", (tournament_id,))
    tournament = cursor.fetchone()
    if not tournament:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tournament not found")
    cursor.execute("SELECT * FROM team WHERE tournament_id = %s", (tournament_id,))
    teams = cursor.fetchall()
    players = []
    for team in teams:
        cursor.execute("SELECT * FROM player natural join (select name as team_name, team_id from team) as team WHERE team_id = %s", (team["team_id"],))
        players += cursor.fetchall()
    cursor.close()
    conn.close()
    return players

