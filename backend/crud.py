from sqlalchemy.orm import Session
from models import Tournament, Player, Match
from schemas import TournamentCreate
import random
import math


def create_tournament(db: Session, tournament: TournamentCreate):
    # Create tournament
    db_tournament = Tournament(name=tournament.name)
    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    
    # Create players
    players = []
    for player_name in tournament.players:
        db_player = Player(name=player_name, tournament_id=db_tournament.id)
        db.add(db_player)
        players.append(db_player)
    
    db.commit()
    
    # Shuffle players for random pairing
    random.shuffle(players)
    
    # Add bye players if needed (for perfect bracket)
    num_players = len(players)
    next_power_of_2 = 2 ** math.ceil(math.log2(num_players))
    
    # Create bye players
    for i in range(next_power_of_2 - num_players):
        bye_player = Player(name=f"BYE_{i + 1}", tournament_id=db_tournament.id)
        db.add(bye_player)
        players.append(bye_player)
    
    db.commit()
    
    # Create first round matches
    create_bracket(db, db_tournament.id, players)
    
    # Update tournament status
    db_tournament.status = "in_progress"
    db.commit()
    
    return db_tournament


def create_bracket(db: Session, tournament_id: int, players: list):
    round_number = 1
    current_players = players.copy()
    
    # Only create the first round matches initially
    # Let advance_tournament handle subsequent rounds
    matches_in_round = len(current_players) // 2
    
    for match_num in range(matches_in_round):
        player1 = current_players[match_num * 2]
        player2 = current_players[match_num * 2 + 1]
        
        # Auto-advance if one player is a bye
        winner_id = None
        is_completed = False
        
        if player1.name.startswith("BYE_"):
            winner_id = player2.id
            is_completed = True
        elif player2.name.startswith("BYE_"):
            winner_id = player1.id
            is_completed = True
        
        match = Match(
            tournament_id=tournament_id,
            round_number=round_number,
            match_number=match_num + 1,
            player1_id=player1.id,
            player2_id=player2.id,
            winner_id=winner_id,
            is_completed=is_completed
        )
        db.add(match)
    
    db.commit()
    
    # If there are matches that are auto-completed (byes), advance the tournament
    advance_tournament(db, tournament_id, round_number)


def get_tournament(db: Session, tournament_id: int):
    return db.query(Tournament).filter(Tournament.id == tournament_id).first()


def get_tournaments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Tournament).offset(skip).limit(limit).all()


def update_match_winner(db: Session, match_id: int, winner_id: int):
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        return None
    
    match.winner_id = winner_id
    match.is_completed = True
    db.commit()
    
    # Check if we need to advance to next round
    advance_tournament(db, match.tournament_id, match.round_number)
    
    return match


def advance_tournament(db: Session, tournament_id: int, completed_round: int):
    # Get all matches in the completed round
    round_matches = db.query(Match).filter(
        Match.tournament_id == tournament_id,
        Match.round_number == completed_round
    ).all()
    
    # Check if all matches in round are completed
    if not all(match.is_completed for match in round_matches):
        return
    
    # Get winners
    winners = [match.winner for match in round_matches if match.winner]
    
    if len(winners) <= 1:
        # Tournament is complete
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        tournament.status = "completed"
        db.commit()
        return
    
    # Create next round matches
    next_round = completed_round + 1
    
    for i in range(0, len(winners), 2):
        if i + 1 < len(winners):
            player1 = winners[i]
            player2 = winners[i + 1]
            
            match = Match(
                tournament_id=tournament_id,
                round_number=next_round,
                match_number=(i // 2) + 1,
                player1_id=player1.id,
                player2_id=player2.id,
                is_completed=False
            )
            db.add(match)
    
    db.commit()
