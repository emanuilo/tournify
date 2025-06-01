import React, { useState } from 'react';

const CreateTournament = ({ onTournamentCreated }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [players, setPlayers] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const updatePlayer = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validPlayers = players.filter(player => player.trim() !== '');
    
    if (!tournamentName.trim()) {
      alert('Please enter a tournament name');
      return;
    }
    
    if (validPlayers.length < 2) {
      alert('Please add at least 2 players');
      return;
    }

    setIsLoading(true);
    try {
      await onTournamentCreated({
        name: tournamentName,
        players: validPlayers
      });
    } catch (error) {
      alert('Error creating tournament: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Tournament</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tournament Name:</label>
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            placeholder="Enter tournament name"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Players:</label>
          {players.map((player, index) => (
            <div key={index} style={styles.playerRow}>
              <input
                type="text"
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                style={styles.playerInput}
              />
              {players.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPlayer}
            style={styles.addButton}
          >
            Add Player
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={styles.createButton}
        >
          {isLoading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  playerRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  playerInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  removeButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  createButton: {
    padding: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default CreateTournament;
