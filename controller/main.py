from fastapi import FastAPI
from auth import auth
from match import match
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

app.include_router(auth)
app.include_router(match)
app.include_router(tournament)


def main():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()