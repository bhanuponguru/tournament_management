from fastapi import FastAPI
from auth import auth

app = FastAPI()



app.include_router(auth)

def main():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()