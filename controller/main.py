from fastapi import FastAPI
from admin import admin
from auth import auth
from match import match
from player import player
from team import team
from tournament import tournament
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, etc.
    allow_headers=["*"],  # Allows all headers
)
app.include_router(admin, prefix="/admin", tags=["admin"])
app.include_router(auth, prefix="/users", tags=["authentication"])
app.include_router(match, prefix="/matches", tags=["matches"])
app.include_router(player, prefix="/players", tags=["players"])
app.include_router(team, prefix="/teams", tags=["teams"])
app.include_router(tournament, prefix="/tournaments", tags=["tournaments"])



def main():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()