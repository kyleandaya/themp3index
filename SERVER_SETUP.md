# Server Setup Guide

This application now uses a database-backed backend to store memories so they can be shared across all users.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:3001` by default.

3. **Start the frontend (in a separate terminal):**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` by default.

## Configuration

The frontend is configured to connect to `http://localhost:3001` by default. If you need to change the API URL, create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3001
```

For production, set this to your production API URL.

## Database

The application uses SQLite, which creates a `memories.db` file in the `server/` directory automatically on first run.

## File Storage

Uploaded audio files are stored in the `server/uploads/` directory. Make sure this directory exists and has write permissions.

## API Endpoints

- `GET /api/memories` - Get all memories
- `GET /api/memories/:id` - Get a specific memory by ID
- `POST /api/memories` - Create a new memory (requires multipart/form-data with `audioFile`, `recipientName`, `memory`, and optional `labelColor`)

## Production Deployment

For production:
1. Set the `VITE_API_URL` environment variable to your production API URL
2. Build the frontend: `npm run build`
3. Serve the backend with a process manager like PM2
4. Use a reverse proxy (nginx) to serve both frontend and backend
5. Consider using PostgreSQL instead of SQLite for better performance and concurrent access

