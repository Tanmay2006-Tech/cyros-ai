# Cyros AI - AI Diet & Fitness Planner

## Overview
A cyberpunk-themed AI Diet & Fitness Planner web app built for a 4th-semester student exhibition. Uses React + Express 5/Node.js backend with PostgreSQL and OpenAI (gpt-4o via Replit AI Integrations).

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, wouter routing
- **Backend**: Express 5, Node.js, PostgreSQL (Drizzle ORM)
- **AI**: OpenAI gpt-4o via Replit AI Integrations (env vars: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **Design**: Cyberpunk — neon purple, cyan, hot pink; dark bg `#050505`; Outfit font

## Key Files
- `server/engine.ts` — OpenAI wrapper using Replit AI Integrations
- `server/routes.ts` — API routes, `registerRoutes(httpServer, app)`
- `server/vite.ts` — Vite dev server setup (DO NOT add `plugins: [react()]` here — it loads from `vite.config.ts`)
- `server/storage.ts` — Database CRUD operations
- `shared/schema.ts` — Drizzle schema (users, plans, meals)
- `shared/routes.ts` — Shared API route definitions
- `client/src/App.tsx` — Frontend routing

## Important Notes
- User hardcoded as "Sachin" (id=1)
- XP system stored in `localStorage` keys `cyros_xp` and `cyros_streak`
- Seed data created automatically on first run
- `vite.config.ts` must have `allowedHosts: true` for Replit preview
- Demo data: hardcoded fallback arrays for charts; Sachin ranked #1 in leaderboard
