# Cyros AI - AI Diet & Fitness Planner

## Overview
A cyberpunk-themed AI Diet & Fitness Planner web app built for a 4th-semester student exhibition. Uses React + Express 5/Node.js backend with PostgreSQL and OpenAI (gpt-4o via Replit AI Integrations).

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, wouter routing
- **Backend**: Express 5, Node.js, PostgreSQL (Drizzle ORM)
- **AI**: OpenAI gpt-4o via Replit AI Integrations on Replit; OpenRouter (free models) or Google Gemini 2.0 Flash (free) for local use
- **Design**: Cyberpunk — neon purple, cyan, hot pink; dark bg `#050505`; Outfit font

## Key Files
- `server/engine.ts` — AI provider: checks for Replit AI Integration > OpenRouter > Gemini > randomized fallback
- `server/routes.ts` — API routes, `registerRoutes(httpServer, app)`
- `server/vite.ts` — Vite dev server setup (DO NOT add `plugins: [react()]` here — it loads from `vite.config.ts`)
- `server/storage.ts` — Database CRUD operations
- `shared/schema.ts` — Drizzle schema (users, plans, meals)
- `shared/routes.ts` — Shared API route definitions
- `client/src/App.tsx` — Frontend routing

## Pages
- **Home** (`/`) — Dashboard with health stats, calorie ring, macro progress, motivational quotes
- **Profile** (`/profile`) — Health data input (controlled inputs), AI plan generation
- **Plan** (`/plan`) — 7-day fitness plan display with PDF export
- **Nutrition** (`/nutrition`) — Daily meal logging and macro tracking
- **Challenges** (`/challenges`) — XP gamification, streaks, tier system
- **Analytics** (`/progress`) — Charts and leaderboard
- **Calculator** (`/calculator`) — BMI, BMR, TDEE, Water Intake, Protein Need, Body Fat % calculators

## Important Notes
- User hardcoded as "Sachin" (id=1)
- XP system stored in `localStorage` keys `cyros_xp` and `cyros_streak`
- Seed data created automatically on first run
- `vite.config.ts` must have `allowedHosts: true` for Replit preview
- Profile form uses controlled inputs with `useState`/`useEffect` (not `defaultValue`)
- `staleTime: 30 * 1000` in `queryClient.ts` (NOT Infinity) for data freshness
- Decorative overlay divs must have `pointer-events-none` to not block clicks
- Local `.env` needs: `DATABASE_URL`, `SESSION_SECRET`, `OPENROUTER_API_KEY` (or `GEMINI_API_KEY`)
- PDF export uses `jspdf` (client-side, lazy imported)
