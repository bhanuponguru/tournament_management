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
    batsman_id: int
    bowler_id: int
    bowler_score: int = 0
    batsman_score: str
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

class match_update(BaseModel):
    match_id: int

class match_info(BaseModel):
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
    if data.batsman_score != 'wicket': data.batsman_score = int(data.batsman_score)
    else: data.batsman_score = 0
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
    cursor.execute("INSERT INTO log (match_id, batsman_id, bowler_id, bowler_score, batsman_score, ball_type, wicket_type, wicket_by_id, catch_by_id, is_stumping) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (data.match_id, data.batsman_id, data.bowler_id, data.bowler_score, data.batsman_score, data.ball_type, data.wicket_type or None, data.wicket_by_id or None, data.catch_by_id or None, data.is_stumping))
    if data.wicket_type:
        if data.wicket_type != "run_out": cursor.execute("UPDATE player SET wickets = wickets + 1 WHERE player_id = %s", (data.bowler_id,))
        cursor.execute("update player set innings = innings + 1 where player_id = %s", (data.batsman_id,))
    cursor.execute("update player set batsman_runs = batsman_runs + %s where player_id = %s", (data.batsman_score, data.batsman_id))
    cursor.execute("update player set bowler_runs = bowler_runs + %s where player_id = %s", (data.bowler_score, data.bowler_id))
    cursor.execute("select inning, first_batting from matches where match_id = %s", (data.match_id,))
    info = cursor.fetchone()
    if info["inning"] == 1:
        if info["first_batting"] == "team_a": cursor.execute("update matches set team_a_score = team_a_score + %s, team_a_balls = team_a_balls + %s where match_id = %s", (data.bowler_score, 1 if data.ball_type == "legal" else 0, data.match_id))
        else: cursor.execute("update matches set team_b_score = team_b_score + %s, team_b_balls = team_b_balls + %s where match_id = %s", (data.bowler_score, 1 if data.ball_type == "legal" else 0, data.match_id))
        if data.wicket_type: cursor.execute("update matches set team_a_wickets = team_a_wickets + 1 where match_id = %s", (data.match_id,))
    else:
        if info["first_batting"] == "team_a": cursor.execute("update matches set team_b_score = team_b_score + %s, team_b_balls = team_b_balls + %s where match_id = %s", (data.bowler_score, 1 if data.ball_type == "legal" else 0, data.match_id))
        else: cursor.execute("update matches set team_a_score = team_a_score + %s, team_a_balls = team_a_balls + %s where match_id = %s", (data.bowler_score, 1 if data.ball_type == "legal" else 0, data.match_id))
        if data.wicket_type: cursor.execute("update matches set team_b_wickets = team_b_wickets + 1 where match_id = %s", (data.match_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Log updated successfully"}

@match.put("/complete")
def complete_match(data: match_update, user: dict = Depends(get_current_user)):
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
    team_a_rr=match["team_a_score"]/(match["team_a_balls"]/6)
    team_b_rr=match["team_b_score"]/(match["team_b_balls"]/6)
    cursor.execute("update team set nrr = nrr + %s where team_id = %s", (team_a_rr - team_b_rr, match["team_a_id"]))
    cursor.execute("update team set nrr = nrr + %s where team_id = %s", (team_b_rr - team_a_rr, match["team_b_id"]))
    cursor.execute("update team set matches_played = matches_played + 1 where team_id = %s", (match["team_a_id"],))
    cursor.execute("update team set matches_played = matches_played + 1 where team_id = %s", (match["team_b_id"],))
    if match["team_a_score"] > match["team_b_score"]:
        cursor.execute("update team set points = points + 2, wins = wins + 1 where team_id = %s", (match["team_a_id"],))
        cursor.execute("update team set losses = losses + 1 where team_id = %s", (match["team_b_id"],))
        cursor.execute("update matches set outcome = %s where match_id = %s", ("team_a", data.match_id))
    elif match["team_a_score"] < match["team_b_score"]:
        cursor.execute("update team set points = points + 2, wins = wins + 1 where team_id = %s", (match["team_b_id"],))
        cursor.execute("update team set losses = losses + 1 where team_id = %s", (match["team_a_id"],))
        cursor.execute("update matches set outcome = %s where match_id = %s", ("team_b", data.match_id))
    else:
        cursor.execute("update team set points = points + 1 where team_id = %s", (match["team_a_id"],))
        cursor.execute("update team set points = points + 1 where team_id = %s", (match["team_b_id"],))
        cursor.execute("update matches set outcome = %s where match_id = %s", ("draw", data.match_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Match completed successfully"}

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
    for m in matches:
        match_id = m["match_id"]
        cursor.execute("SELECT * FROM matches WHERE match_id = %s", (match_id,))
        match = cursor.fetchone()
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        cursor.execute("SELECT * FROM log natural join (select player_id as batsman_id, name as batsman_name from player) as batsman natural join (select player_id as bowler_id, name as bowler_name from player) as bowler left join (select player_id as wicket_by_id, name as wicket_by_name from player) as wicket_by on log.wicket_by_id = wicket_by.wicket_by_id left join (select player_id as catch_by_id, name as catch_by_name from player) as catch_by on log.catch_by_id = catch_by.catch_by_id WHERE match_id = %s order by date_time desc limit 1", (match_id,))
        last_update = cursor.fetchone()
        if not last_update:
            m["last_update"] = None
            continue
        batsman_id = last_update["batsman_id"]
        bowler_id = last_update["bowler_id"]
        cursor.execute("select batsman_id, batsman_name, sum(batsman_score) as batsman_score, count(batsman_id) as balls_played from log natural join (select player_id as batsman_id, name as batsman_name from player where player_id = %s) as batsman where match_id = %s", (batsman_id, match_id))
        batsman_stats = cursor.fetchone()
        cursor.execute("select bowler_id, bowler_name, sum(bowler_score) as bowler_runs, sum(ball_type = 'legal') as balls_bowled, sum(wicket_type is not null and wicket_type != 'run_out') as wickets from log natural join (select player_id as bowler_id, name as bowler_name from player where player_id = %s) as bowler where match_id = %s", (bowler_id, match_id))
        bowler_stats = cursor.fetchone()
        cursor.execute("select batsman_id, bowler_id from log natural join (select player_id as batsman_id, name as batsman_name from player where player_id = %s) as batsman natural join (select player_id as bowler_id, name as bowler_name from player where player_id = %s) as bowler where match_id = %s and wicket_type is not null order by date_time desc limit 1", (batsman_id, bowler_id, match_id))
        last_wicket = cursor.fetchone()
        result={}
        result["last_update"] = last_update
        result["batsman_statistics"] = batsman_stats
        result["bowler_statistics"] = bowler_stats
        result["last_wicket"] = last_wicket
        m["last_update"] = result
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
def update_inning(data: match_update, user: dict = Depends(get_current_user)):
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

@match.get('/player_statistics')
def get_players_statistics(match_id: int, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("select * from matches where match_id = %s", (match_id,))
    match = cursor.fetchone()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    team_a_id = match["team_a_id"]
    team_b_id = match["team_b_id"]
    cursor.execute("select batsman_id, batsman_name,  sum(batsman_score) as batsman_score, count(batsman_id) as balls_played, max(wicket_type is not null) as is_wicket from log natural join (select player_id as batsman_id, name as batsman_name from player where team_id = %s) as batsman where match_id = %s group by batsman_id", (team_a_id, match_id))
    team_a_batsman_stats = cursor.fetchall()
    cursor.execute("select batsman_id, batsman_name,  sum(batsman_score) as batsman_score, count(batsman_id) as balls_played, max(wicket_type is not null) as is_wicket from log natural join (select player_id as batsman_id, name as batsman_name from player where team_id = %s) as batsman where match_id = %s group by batsman_id", (team_b_id, match_id))
    team_b_batsman_stats = cursor.fetchall()
    cursor.execute("select bowler_id, bowler_name, sum(bowler_score) as bowler_runs, count(bowler_id) as balls_bowled, sum(wicket_type is not null and wicket_type != 'run_out') as wickets from log natural join (select player_id as bowler_id, name as bowler_name from player where team_id = %s) as bowler where match_id = %s group by bowler_id", (team_a_id, match_id))
    team_a_bowler_stats = cursor.fetchall()
    cursor.execute("select bowler_id, bowler_name, sum(bowler_score) as bowler_runs, count(bowler_id) as balls_bowled, sum(wicket_type is not null and wicket_type != 'run_out') as wickets from log natural join (select player_id as bowler_id, name as bowler_name from player where team_id = %s) as bowler where match_id = %s group by bowler_id", (team_b_id, match_id))
    team_b_bowler_stats = cursor.fetchall()
    cursor.close()
    conn.close()
    result={
        "team_a_batsman_stats": team_a_batsman_stats,
        "team_b_batsman_stats": team_b_batsman_stats,
        "team_a_bowler_stats": team_a_bowler_stats,
        "team_b_bowler_stats": team_b_bowler_stats
    }
    return result

