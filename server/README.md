# Morse Code API Server

Backend API สำหรับเกม Morse Code

## Requirements

- Node.js 18+
- PostgreSQL Database

## Setup

1. Clone repo
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

4. Push database schema:
```bash
npx prisma db push
npx prisma generate
```

5. Seed words (optional):
```bash
# Call POST http://localhost:3001/api/random/words/seed
```

6. Run server:
```bash
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Results (requires auth)
- `GET /api/results` - Get all results
- `POST /api/results` - Save result
- `GET /api/results/stats` - Get overall stats
- `GET /api/results/stats/detailed` - Get detailed stats by mode

### Random
- `GET /api/random/letters?count=10` - Random letters
- `GET /api/random/words?count=10` - Random words from DB
- `GET /api/random/words/list` - List all words

### Settings (requires auth)
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

## Deploy to Railway

1. Push to GitHub
2. Connect Railway to GitHub
3. Add environment variables in Railway dashboard
4. Deploy!
