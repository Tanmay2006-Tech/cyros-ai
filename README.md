# Cyros AI - Diet & Fitness Planner

A cyberpunk-themed diet and fitness planning web application built for a 4th-semester student exhibition.

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenRouter API (Google Gemini 2.0 Flash)
- **UI**: shadcn/ui + Lucide Icons

## Features

- AI-powered weekly fitness & diet plan generation
- Diet preference support (Veg / Non-Veg / Vegan / Eggetarian)
- Macro tracking (Calories, Protein, Carbs, Fats)
- Daily meal logging with nutrition breakdown
- Health calculators (BMI, BMR, TDEE, Water Intake, Body Fat %)
- XP gamification system with daily challenges
- PDF export for generated plans
- Cyberpunk UI with neon aesthetics

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or later)
- [OpenRouter API Key](https://openrouter.ai/) (free)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cyros_db
   SESSION_SECRET=your_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open **http://localhost:5000**

## Deployment (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables (`DATABASE_URL`, `SESSION_SECRET`, `OPENROUTER_API_KEY`)
4. Use an external PostgreSQL provider (Neon, Supabase, Railway)
5. Deploy

## Project Structure

```
client/src/          # React frontend
  pages/             # Page components
  components/        # Reusable UI components
  hooks/             # Custom React hooks
  lib/               # Utilities
server/              # Express backend
  engine.ts          # AI plan generation engine
  routes.ts          # API endpoints
  storage.ts         # Database operations
  db.ts              # Database connection
shared/              # Shared types and schemas
  schema.ts          # Drizzle ORM schema
  routes.ts          # API route definitions
api/                 # Vercel serverless functions
```

## Troubleshooting

- **White screen**: Delete the `node_modules/.vite` folder and restart
- **Database errors**: Make sure PostgreSQL is running and DATABASE_URL is correct
- **Port conflict**: The app runs on port 5000 by default. Change PORT in .env if needed

## Author

Sachin
