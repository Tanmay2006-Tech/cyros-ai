# Cyros AI - Diet & Fitness Planner

## Overview
A cyberpunk-themed Diet & Fitness Planner web app built for a 4th-semester student exhibition. Uses React + Express 5/Node.js backend with PostgreSQL.

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, wouter routing
- **Backend**: Express 5, Node.js, PostgreSQL (Drizzle ORM)
- **AI**: OpenRouter API (google/gemini-2.0-flash-exp:free) for plan generation, with Gemini fallback
- **Design**: Cyberpunk — neon purple, cyan, hot pink; dark bg `#050505`; Outfit font

## Key Files
- `server/engine.ts` — AI provider: OpenRouter > Gemini > randomized fallback
- `server/routes.ts` — API routes
- `server/storage.ts` — Database CRUD operations
- `shared/schema.ts` — Drizzle schema (users, plans, meals)
- `shared/routes.ts` — Shared API route definitions
- `client/src/App.tsx` — Frontend routing

## Pages
- **Home** (`/`) — Dashboard with health stats, calorie ring, macro progress, motivational quotes
- **Profile** (`/profile`) — Health data input, diet preference (veg/non-veg/vegan/eggetarian), AI plan generation
- **Plan** (`/plan`) — 7-day fitness & diet plan with day slider, PDF export
- **Nutrition** (`/nutrition`) — Daily meal logging and macro tracking
- **Challenges** (`/challenges`) — XP gamification, streaks, tier system
- **Analytics** (`/progress`) — Charts and leaderboard
- **Calculator** (`/calculator`) — BMI, BMR, TDEE, Water Intake, Protein Need, Body Fat % calculators

## Diet Preference
- Users can choose: Vegetarian, Non-Vegetarian, Vegan, Eggetarian
- Stored in `users.dietPreference` column
- AI prompt and fallback generator both filter meals based on preference

## Deployment (Vercel)
- `vercel.json` — routes config, rewrites API to serverless function
- `api/index.ts` — Express app wrapped as Vercel serverless function
- Build: `npm run build` outputs frontend to `dist/public`
- Environment variables needed: `DATABASE_URL`, `SESSION_SECRET`, `OPENROUTER_API_KEY`
- Database: Use external PostgreSQL (Neon, Supabase, Railway)
- Run `npx drizzle-kit push` against your external DB to set up tables

## Important Notes
- User hardcoded as "Sachin" (id=1)
- XP system stored in `localStorage` keys `cyros_xp` and `cyros_streak`
- Seed data created automatically on first run
- Profile form uses controlled inputs with `useState`/`useEffect`
- `staleTime: 30 * 1000` in `queryClient.ts` for data freshness
- Decorative overlay divs must have `pointer-events-none`
- `.env` needs: `DATABASE_URL`, `SESSION_SECRET`, `OPENROUTER_API_KEY`
- PDF export uses `jspdf` (client-side, lazy imported)
