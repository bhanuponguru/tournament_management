from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from db import get_connection
from pydantic import BaseModel

class Player(BaseModel):
    name: str
    team_id: int
    is_captain: bool

player = APIRouter()

@player.post("/create")
def create_player(data: Player, user: dict = Depends(get_current_user)):
    if user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("select * from team where team_id=%s", (data.team_id,))
    team = cursor.fetchone()
    if not team:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Team not found")
    cursor.execute("select * from tournament where tournament_id=%s", (team["tournament_id"],))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized to perform this action")
    if team['captain_id'] and data.is_captain:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Captain already exists")
    
    cursor.execute("INSERT INTO player (name, team_id) VALUES (%s, %s)", (data.name, data.team_id))
    if data.is_captain:
        captain_id = cursor.lastrowid
        cursor.execute("update team set captain_id=%s where team_id=%s", (captain_id, data.team_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Player created successfully"}
