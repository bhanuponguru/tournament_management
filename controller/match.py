from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from db import get_connection
from pydantic import BaseModel
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
def get_matches(user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM match")
    cursor.close()
    conn.close()
    return cursor.fetchall()

@match.get("/{match_id}")
def get_match(match_id: int, user: dict = Depends(get_current_user)):
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM match WHERE match_id = %s", (match_id,))
    match = cursor.fetchone()
    cursor.close()
    conn.close()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@match.post("/{match_id}/score")
def update_score(score: score_update, user: dict = Depends(get_current_user)):
    if user["role"] != "manager":
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    match_id=score.match_id
    cursor.execute("SELECT * FROM match WHERE match_id = %s", (match_id,))
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
    #update score
    cursor.execute("INSERT INTO log (match_id, batsman_id, bowler_id, bowler_score, batsman_score, ball_type, wicket_type, wicket_by_id, catch_by_id, is_stumping) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match_id, score.batsman_id, score.bowler_id, score.bowler_score, score.batsman_score, score.ball_type, score.wicket_type, score.wicket_by_id, score.catch_by_id, score.is_stumping))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Score updated successfully"}

@match.get("/match/today")
def get_matches_today(user: dict = Depends(get_current_user)):
    if user['role'] != 'manager':
        raise HTTPException(status_code=403, detail="You are not a manager")
    conn=get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM match WHERE date_time >= CURDATE() AND date_time < CURDATE() + INTERVAL 1 DAY")
    matches= cursor.fetchall()
    matches2=[]
    for match in matches:
        cursor.execute("select * from team where team_id = %s", (match["team_a"],))
        team_a = cursor.fetchone()
        cursor.execute("select * from team where team_id = %s", (match["team_b"],))
        team_b = cursor.fetchone()
        match["team_a"] = team_a
        match["team_b"] = team_b
        matches2.append(match)
    cursor.close()
    conn.close()
    return matches2
