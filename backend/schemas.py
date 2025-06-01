from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PlayerCreate(BaseModel):
    name: str

class PlayerResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class TournamentCreate(BaseModel):
    name: str
    players: List[str]

class MatchResponse(BaseModel):
    id: int
    round_number: int
    match_number: int
    player1: Optional[PlayerResponse] = None
    player2: Optional[PlayerResponse] = None
    winner: Optional[PlayerResponse] = None
    is_completed: bool
    
    class Config:
        from_attributes = True

class TournamentResponse(BaseModel):
    id: int
    name: str
    status: str
    created_at: datetime
    players: List[PlayerResponse]
    matches: List[MatchResponse]
    
    class Config:
        from_attributes = True

class UpdateMatchWinner(BaseModel):
    winner_id: int
