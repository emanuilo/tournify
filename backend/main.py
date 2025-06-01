from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from models import Base
import crud
import schemas

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tournify API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Tournify API!"}


@app.get("/events")
def get_events():
    """Placeholder endpoint to handle legacy/external requests to /events"""
    return {"message": "No events endpoint available", "tournaments_endpoint": "/tournaments/"}


@app.post("/tournaments/", response_model=schemas.TournamentResponse)
def create_tournament(tournament: schemas.TournamentCreate, db: Session = Depends(get_db)):
    if len(tournament.players) < 2:
        raise HTTPException(status_code=400, detail="Tournament must have at least 2 players")
    
    return crud.create_tournament(db=db, tournament=tournament)

@app.get("/tournaments/", response_model=list[schemas.TournamentResponse])
def read_tournaments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tournaments = crud.get_tournaments(db, skip=skip, limit=limit)
    return tournaments

@app.get("/tournaments/{tournament_id}", response_model=schemas.TournamentResponse)
def read_tournament(tournament_id: int, db: Session = Depends(get_db)):
    tournament = crud.get_tournament(db, tournament_id=tournament_id)
    if tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")
    return tournament

@app.patch("/matches/{match_id}/winner")
def update_match_winner(
    match_id: int, 
    winner_data: schemas.UpdateMatchWinner, 
    db: Session = Depends(get_db)
):
    match = crud.update_match_winner(db, match_id=match_id, winner_id=winner_data.winner_id)
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return {"message": "Match winner updated successfully"}

@app.get("/events")
def get_events():
    """Placeholder endpoint to handle legacy/external requests to /events"""
    return {"message": "No events endpoint available", "tournaments_endpoint": "/tournaments/"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
