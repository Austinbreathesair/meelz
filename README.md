# Meelz — Pantry → Recipe PWA (MVP)

Offline-first Next.js + Supabase to manage pantry, search recipes, save and scale them, and track budget from a simple ledger. PWA with IndexedDB and service worker.

## Stack
- Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Headless UI
- Supabase (Auth, Postgres w/ RLS, Storage, Edge Functions, Edge Jobs)
- PWA: Service Worker + manifest + Dexie (IndexedDB)
- Tests: Vitest + RTL, Playwright E2E, k6 perf

## Quickstart
1. Copy `.env.example` to `.env.local` and fill Supabase details
2. Install deps: `pnpm i`
3. Dev: `pnpm dev` (http://localhost:3000)
4. Typecheck/lint/tests: `pnpm typecheck && pnpm lint && pnpm test`

## Database
SQL under `schema/`:
- `ddl.sql`: tables and indexes
- `policies.sql`: RLS policies
- `seeds.sql`: demo data

## Deploy
- Frontend: Vercel (free tier)
- Backend: Supabase project (free tier)

## Scripts
See `package.json` scripts for dev, test, e2e, and perf runs.

- k6 perf: install k6 locally (https://k6.io/docs/get-started/installation/) then run `npm run k6`.
