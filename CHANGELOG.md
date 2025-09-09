# Changelog

## v0.2.0 – UI overhaul, subagents hardening, and agents run API

- UI foundation
  - Tailwind v4 tokens for shadcn/ui in `src/app/globals.css`
  - Added shadcn CLI config `components.json`
  - Synced/added core UI primitives: Button, Card, Input, Tooltip, Dialog, Dropdown, Popover, Separator, Sonner
  - Dark mode toggle + no‑FOUC init script; Toaster wiring (Sonner)
  - Demo routes: `/ui-demo`, `/ui-advanced-demo`
- Subagents platform
  - Server-side executor (`src/lib/subagent-exec.ts`) and registry (`src/lib/subagent-registry.ts`)
  - API routes refactor to use server exec: `/api/subagents/invoke`, `/api/subagents/[agent]`, `/api/subagents/list`
  - Orchestrator now calls server exec; removed dead constants
- Dev UX
  - Seed endpoints: `POST /api/dev/create-test-company`, `GET /api/dev/seeded-companies`, `POST /api/dev/clean-test-data`
  - Analytics page: create/load/select test companies and run auto‑subagents
- Agents run API
  - `POST /api/agents/run` with `capability: "enrichment.waterfall"`
  - Writes AgentAuditLog, creates Activity, and persists EnrichmentSignal rows
- Data model
  - Added Prisma models: AgentAuditLog, EnrichmentSignal
  - Seed script: `prisma/seed.js` and `npm run db:seed`
- Misc
  - ESM env-check: `scripts/env-check.mjs` and updated prestart
  - Ignored and removed binary caches from repo history (`.fastembed_cache/`, `.codanna/`)

## Upgrade notes
- Set `DATABASE_URL` and run: `npx prisma generate && npx prisma migrate deploy`
- Optional envs for richer outputs: `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`
- Dev flow: `npm run dev` → `/analytics` → Create Test Company → Run Auto‑Subagents
