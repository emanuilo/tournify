import React from 'react';
import { tournamentService } from '../services/api';

const TournamentBracket = ({ tournament, onMatchUpdate }) => {
  const handleSetWinner = async (matchId, winnerId) => {
    try {
      await tournamentService.updateMatchWinner(matchId, winnerId);
      onMatchUpdate();
    } catch (error) {
      alert('Error updating match: ' + error.message);
    }
  };

  const renderMatch = (match) => {
    const { player1, player2, winner, is_completed } = match;
    
    // Skip matches with bye players
    if ((player1?.name?.startsWith('BYE_')) || (player2?.name?.startsWith('BYE_'))) {
      return null;
    }

    return (
      <div key={match.id} style={styles.match}>
        <div style={styles.matchHeader}>
          Round {match.round_number} - Match {match.match_number}
        </div>
        <div style={styles.players}>
          <div 
            style={{
              ...styles.player,
              ...(winner?.id === player1?.id ? styles.winner : {}),
              ...(is_completed ? {} : styles.clickable)
            }}
            onClick={() => !is_completed && handleSetWinner(match.id, player1?.id)}
          >
            {player1?.name || 'TBD'}
          </div>
          <div style={styles.vs}>VS</div>
          <div 
            style={{
              ...styles.player,
              ...(winner?.id === player2?.id ? styles.winner : {}),
              ...(is_completed ? {} : styles.clickable)
            }}
            onClick={() => !is_completed && handleSetWinner(match.id, player2?.id)}
          >
            {player2?.name || 'TBD'}
          </div>
        </div>
        {is_completed && (
          <div style={styles.winnerText}>
            Winner: {winner?.name}
          </div>
        )}
      </div>
    );
  };

  const groupMatchesByRound = (matches) => {
    const rounds = {};
    matches.forEach(match => {
      if (!rounds[match.round_number]) {
        rounds[match.round_number] = [];
      }
      rounds[match.round_number].push(match);
    });
    return rounds;
  };

  const rounds = groupMatchesByRound(tournament.matches);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{tournament.name}</h2>
      <div style={styles.status}>
        Status: <span style={styles.statusBadge}>{tournament.status}</span>
      </div>
      
      <div style={styles.bracket}>
        {Object.entries(rounds).map(([roundNumber, matches]) => (
          <div key={roundNumber} style={styles.round}>
            <h3 style={styles.roundTitle}>
              {roundNumber === '1' ? 'First Round' : 
               matches.length === 1 ? 'Final' : 
               matches.length === 2 ? 'Semi-Finals' : 
               matches.length === 4 ? 'Quarter-Finals' : 
               `Round ${roundNumber}`}
            </h3>
            <div style={styles.roundMatches}>
              {matches.map(renderMatch)}
            </div>
          </div>
        ))}
      </div>

      {tournament.status === 'completed' && (
        <div style={styles.champion}>
          <h2>🏆 Tournament Champion 🏆</h2>
          <div style={styles.championName}>
            {tournament.matches
              .filter(m => m.round_number === Math.max(...tournament.matches.map(match => match.round_number)))
              .find(m => m.is_completed)?.winner?.name}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px',
  },
  status: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '18px',
  },
  statusBadge: {
    padding: '5px 15px',
    borderRadius: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    textTransform: 'capitalize',
  },
  bracket: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  round: {
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  roundTitle: {
    textAlign: 'center',
    color: '#495057',
    marginBottom: '20px',
    borderBottom: '2px solid #dee2e6',
    paddingBottom: '10px',
  },
  roundMatches: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  match: {
    border: '2px solid #dee2e6',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  matchHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#6c757d',
  },
  players: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  player: {
    padding: '12px',
    border: '2px solid #e9ecef',
    borderRadius: '5px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s ease',
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e9ecef',
      borderColor: '#007bff',
    },
  },
  winner: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    color: '#155724',
    fontWeight: 'bold',
  },
  vs: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6c757d',
    margin: '5px 0',
  },
  winnerText: {
    textAlign: 'center',
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#28a745',
  },
  champion: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '30px',
    backgroundColor: '#fff3cd',
    border: '3px solid #ffc107',
    borderRadius: '15px',
  },
  championName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#856404',
    marginTop: '10px',
  },
};

export default TournamentBracket;
