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
    

class score_update(BaseModel):
    match_id: int
    bowler_score: int
    batsman_score: int
    ball_type: str
    wicket_type: str
    wicket_by_id: int
    catch_by_id: int
    is_stumping: bool


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


@match.put("/score")
def update_score(score: score_update, user: dict = Depends(get_current_user)):
    if user["role"] != "manager" and user["role"] != "organizer":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    match_id=score.match_id
    cursor.execute("SELECT * FROM matches WHERE match_id = %s", (match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    #fetch batsman and bowler and check if they belong to a team in this match
    cursor.execute("SELECT * FROM player WHERE player_id = %s", (score.batsman_id,))
    batsman = cursor.fetchone()
    cursor.execute("SELECT * FROM player WHERE player_id = %s", (score.bowler_id,))
    bowler = cursor.fetchone()
    if not batsman or not bowler:
        raise HTTPException(status_code=404, detail="Player not found")
    cursor.execute("SELECT * FROM team WHERE team_id = %s", (batsman["team_id"],
    ))
    team_a= cursor.fetchone()
    cursor.execute("SELECT * FROM team WHERE team_id = %s", (bowler["team_id"],
    ))
    team_b= cursor.fetchone()
    if not team_a or not team_b or team_a["match_id"] != match_id or team_b["match_id"] != match_id:
        raise HTTPException(status_code=400, detail="Player does not belong to a team in this match")
    cursor.execute("select manager_id, organizer_id from tournament where tournament_id = (select tournament_id from match_tournament_relation where match_id = %s)", (match_id,))
    tournament = cursor.fetchone()
    if user["role"] == "manager" and user["user_id"] != tournament["manager_id"]: raise HTTPException(status_code=403, detail="You are not a manager of this tournament")
    if user["role"] == "organizer" and user["user_id"] != tournament["organizer_id"]: raise HTTPException(status_code=403, detail="You are not an organizer of this tournament")
    #update score
    cursor.execute("INSERT INTO log (match_id, batsman_id, bowler_id, bowler_score, batsman_score, ball_type, wicket_type, wicket_by_id, catch_by_id, is_stumping) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match_id, score.batsman_id, score.bowler_id, score.bowler_score, score.batsman_score, score.ball_type, score.wicket_type, score.wicket_by_id, score.catch_by_id, score.is_stumping))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Score updated successfully"}

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


