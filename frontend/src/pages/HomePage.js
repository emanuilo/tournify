import React, { useState, useEffect } from 'react';
import { tournamentService } from '../services/api';
import CreateTournament from '../components/CreateTournament';
import TournamentList from '../components/TournamentList';
import TournamentBracket from '../components/TournamentBracket';

const HomePage = () => {
  const [view, setView] = useState('list'); // 'list', 'create', 'tournament'
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (tournamentData) => {
    try {
      const newTournament = await tournamentService.createTournament(tournamentData);
      setSelectedTournament(newTournament);
      setView('tournament');
      await loadTournaments();
    } catch (error) {
      throw new Error('Failed to create tournament');
    }
  };

  const handleSelectTournament = async (tournamentId) => {
    try {
      const tournament = await tournamentService.getTournament(tournamentId);
      setSelectedTournament(tournament);
      setView('tournament');
    } catch (error) {
      console.error('Error loading tournament:', error);
    }
  };

  const handleMatchUpdate = async () => {
    if (selectedTournament) {
      try {
        const updatedTournament = await tournamentService.getTournament(selectedTournament.id);
        setSelectedTournament(updatedTournament);
        await loadTournaments();
      } catch (error) {
        console.error('Error updating tournament:', error);
      }
    }
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTournament(null);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.appTitle}>🏆 Tournify</h1>
        <p style={styles.subtitle}>Automatic Tournament Tree Generator</p>
      </header>

      {view === 'list' && (
        <TournamentList
          tournaments={tournaments}
          onSelectTournament={handleSelectTournament}
          onCreateNew={() => setView('create')}
        />
      )}

      {view === 'create' && (
        <>
          <button
            onClick={handleBackToList}
            style={styles.backButton}
          >
            ← Back to Tournaments
          </button>
          <CreateTournament onTournamentCreated={handleCreateTournament} />
        </>
      )}

      {view === 'tournament' && selectedTournament && (
        <>
          <button
            onClick={handleBackToList}
            style={styles.backButton}
          >
            ← Back to Tournaments
          </button>
          <TournamentBracket
            tournament={selectedTournament}
            onMatchUpdate={handleMatchUpdate}
          />
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    marginBottom: '30px',
  },
  appTitle: {
    margin: 0,
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: '10px 0 0 0',
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#6c757d',
  },
  backButton: {
    margin: '20px',
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default HomePage;
