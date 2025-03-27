import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from db import get_connection
from pydantic import BaseModel

class match_create(BaseModel):
    team_a_id: int
    team_b_id: int
    location: str
    date_time: datetime.datetime
    tournament_id: int
    

class log_update(BaseModel):
    match_id: int
    batsman_id: int = 0
    bowler_id: int
    bowler_score: int = 0
    batsman_score: int
    ball_type: str
    wicket_type: str = None
    wicket_by_id: int = None
    catch_by_id: int = None
    is_stumping: bool

class toss_winner(BaseModel):
    match_id: int
    team: str

class first_batting(BaseModel):
    match_id: int
    team: str

class inning_update(BaseModel):
    match_id: int

match= APIRouter()

@match.get("/")
def get_matches(tournament_id: int=None, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    if not tournament_id: cursor.execute("SELECT * FROM matches natural join (select team_id as team_a_id, name as team_a_name from team) as team_a natural join (select team_id as team_b_id, name as team_b_name from team) as team_b")
    else: cursor.execute("SELECT * FROM matches natural join (select team_id as team_a_id, name as team_a_name from team) as team_a natural join (select team_id as team_b_id, name as team_b_name from team) as team_b WHERE match_id in (select match_id from match_tournament_relation where tournament_id = %s)", (tournament_id,))
    matches = cursor.fetchall()
        
    cursor.close()
    conn.close()
    return matches


@match.put("/log")
def update_log(data: log_update, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM matches WHERE match_id = %s", (data.match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = (select tournament_id from match_tournament_relation where match_id = %s)", (data.match_id,))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    cursor.execute("INSERT INTO log (match_id, batsman_id, bowler_id, bowler_score, batsman_score, ball_type, wicket_type, wicket_by_id, catch_by_id, is_stumping) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (data.match_id, data.batsman_id, data.bowler_id, data.bowler_score, data.batsman_score, data.ball_type, data.wicket_type, data.wicket_by_id, data.catch_by_id, data.is_stumping))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Log updated successfully"}

@match.get("/log")
def get_log(match_id: int, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM log natural join (select player_id as batsman_id, name as batsman_name from player) as batsman natural join (select player_id as bowler_id, name as bowler_name from player) as bowler left join (select player_id as wicket_by_id, name as wicket_by_name from player) as wicket_by on log.wicket_by_id = wicket_by.wicket_by_id left join (select player_id as catch_by_id, name as catch_by_name from player) as catch_by on log.catch_by_id = catch_by.catch_by_id WHERE match_id = %s", (match_id,))
    log = cursor.fetchall()
    cursor.close()
    conn.close()
    return log

@match.get("/today")
def get_matches_today(user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM matches natural join (select team_id as team_a_id, name as team_a_name from team) as team_a natural join (select team_id as team_b_id, name as team_b_name from team) as team_b WHERE date_time >= CURDATE() AND date_time < CURDATE() + INTERVAL 1 DAY")
    matches= cursor.fetchall()
    cursor.close()
    conn.close()
    return matches

@match.post("/create")
def create_match(data: match_create, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM team WHERE team_id = %s", (data.team_a_id,))
    team_a = cursor.fetchone()
    cursor.execute("SELECT * FROM team WHERE team_id = %s", (data.team_b_id,))
    team_b = cursor.fetchone()
    if not team_a or not team_b:
        raise HTTPException(status_code=404, detail="Team not found")
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = %s", (data.tournament_id,))
    tournament = cursor.fetchone()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    cursor.execute("INSERT INTO matches (team_a_id, team_b_id, location, date_time) VALUES (%s, %s, %s, %s)", (data.team_a_id, data.team_b_id, data.location, data.date_time))
    match_id = cursor.lastrowid
    cursor.execute("insert into match_tournament_relation (match_id, tournament_id) values (%s, %s)", (match_id, data.tournament_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Match created successfully"}

@match.put("/toss_winner")
def update_toss_winner(data: toss_winner, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM matches WHERE match_id = %s", (data.match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = (select tournament_id from match_tournament_relation where match_id = %s)", (data.match_id,))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    cursor.execute("UPDATE matches SET toss_winner = %s WHERE match_id = %s", (data.team, data.match_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Toss winner updated successfully"}

@match.put("/first_batting")
def update_first_batting(data: first_batting, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM matches WHERE match_id = %s", (data.match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = (select tournament_id from match_tournament_relation where match_id = %s)", (data.match_id,))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    cursor.execute("UPDATE matches SET first_batting = %s WHERE match_id = %s", (data.team, data.match_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "First batting updated successfully"}

@match.put("/update_inning")
def update_inning(data: inning_update, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM matches WHERE match_id = %s", (data.match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    cursor.execute("SELECT * FROM tournament WHERE tournament_id = (select tournament_id from match_tournament_relation where match_id = %s)", (data.match_id,))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]:
        raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]:
        raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    cursor.execute("UPDATE matches SET inning = 2 WHERE match_id = %s", (data.match_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Inning updated successfully"}
