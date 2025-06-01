# Tournify - Automatic Tournament Bracket Generator

A full-stack web application for creating and managing tournament brackets, perfect for beer pong tournaments or any other competitive games.

## Features

- 🏆 **Automatic Bracket Generation**: Just add player names and the app creates a perfect tournament bracket
- 🎯 **Real-time Updates**: Track match progress and automatically advance winners
- 💾 **Persistent Storage**: PostgreSQL database ensures no progress is lost on refresh
- 🐳 **Docker Compose**: Easy deployment with containerized services
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🎮 **Smart Pairing**: Automatic random player pairing and bye handling for odd numbers

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Deployment**: Docker Compose

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tournify
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## How to Use

1. **Create a Tournament**
   - Click "Create New Tournament"
   - Enter a tournament name
   - Add player names (minimum 2 players)
   - Click "Create Tournament"

2. **Manage Matches**
   - Click on a player's name to declare them the winner
   - The bracket automatically updates and advances winners
   - Track progress through each round

3. **View Results**
   - See the tournament champion when completed
   - Browse past tournaments from the main list

## API Endpoints

- `POST /tournaments/` - Create a new tournament
- `GET /tournaments/` - List all tournaments
- `GET /tournaments/{id}` - Get tournament details
- `PATCH /matches/{id}/winner` - Update match winner

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database
The application uses PostgreSQL. When running with Docker Compose, the database is automatically set up with the correct schema.

## Project Structure

```
tournify/
├── docker-compose.yml
├── backend/
│   ├── main.py           # FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # Database configuration
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── package.json
└── README.md
```

## Features in Detail

### Tournament Creation
- Supports any number of players (minimum 2)
- Automatically creates bye players for perfect bracket structure
- Random player pairing for fair competition

### Bracket Management
- Automatic bracket generation based on tournament size
- Real-time match updates
- Progressive winner advancement
- Visual tournament bracket display

### Data Persistence
- All tournament data stored in PostgreSQL
- Survives application restarts
- Complete match history tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
