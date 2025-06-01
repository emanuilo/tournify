import React from 'react';

const TournamentList = ({ tournaments, onSelectTournament, onCreateNew }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in_progress':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Tournament List</h2>
        <button onClick={onCreateNew} style={styles.createButton}>
          Create New Tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No tournaments yet</h3>
          <p>Create your first tournament to get started!</p>
        </div>
      ) : (
        <div style={styles.tournamentGrid}>
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              style={styles.tournamentCard}
              onClick={() => onSelectTournament(tournament.id)}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.tournamentName}>{tournament.name}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(tournament.status),
                  }}
                >
                  {tournament.status.replace('_', ' ')}
                </span>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.info}>
                  <span style={styles.label}>Players:</span>
                  <span>{tournament.players?.filter(p => !p.name.startsWith('BYE_')).length || 0}</span>
                </div>
                
                <div style={styles.info}>
                  <span style={styles.label}>Created:</span>
                  <span>{formatDate(tournament.created_at)}</span>
                </div>

                {tournament.status === 'completed' && (
                  <div style={styles.info}>
                    <span style={styles.label}>Champion:</span>
                    <span style={styles.champion}>
                      {tournament.matches
                        ?.filter(m => m.round_number === Math.max(...tournament.matches.map(match => match.round_number)))
                        ?.find(m => m.is_completed)?.winner?.name || 'TBD'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6c757d',
  },
  tournamentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  tournamentCard: {
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      borderColor: '#007bff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  tournamentName: {
    margin: 0,
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#6c757d',
  },
  champion: {
    color: '#28a745',
    fontWeight: 'bold',
  },
};

export default TournamentList;
