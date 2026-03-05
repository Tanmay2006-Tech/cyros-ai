# Cyros AI - Diet & Fitness Planner

A cyberpunk-themed AI-powered diet and fitness planning web application.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini 2.0 Flash (FREE)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or later)

## Setup

### 1. Get a Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

### 2. Create the Database

Open pgAdmin or a terminal and create a new database:

```sql
CREATE DATABASE cyros_db;
```

### 3. Create Environment File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and Gemini API key:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cyros_db
SESSION_SECRET=cyros_super_secret
GEMINI_API_KEY=your_gemini_api_key_here
```

> The app works without an API key too — it will use sample fitness data instead.

### 4. Install Dependencies

```bash
npm install
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Start the App

```bash
npm run dev
```

Open your browser at **http://localhost:5000**

## Project Structure

```
client/          - React frontend (Vite)
server/          - Express backend
shared/          - Shared types and schemas (Drizzle ORM)
drizzle.config.ts
package.json
vite.config.ts
```

## Troubleshooting

- **White screen**: Delete the `node_modules/.vite` folder and restart.
- **Database errors**: Make sure PostgreSQL is running and your DATABASE_URL is correct.
- **Port conflict**: The app runs on port 5000 by default. Change PORT in your .env if needed.
