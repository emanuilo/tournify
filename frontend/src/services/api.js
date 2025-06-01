import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tournamentService = {
  createTournament: async (tournamentData) => {
    const response = await api.post('/tournaments/', tournamentData);
    return response.data;
  },

  getTournaments: async () => {
    const response = await api.get('/tournaments/');
    return response.data;
  },

  getTournament: async (id) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  updateMatchWinner: async (matchId, winnerId) => {
    const response = await api.patch(`/matches/${matchId}/winner`, {
      winner_id: winnerId,
    });
    return response.data;
  },
};

export default api;
