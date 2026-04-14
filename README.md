# LuxeMart eCommerce App

Premium full-stack eCommerce monorepo built with React + Vite + TypeScript on the frontend, Express + TypeScript on the backend, and Supabase for authentication and database.

## Tech Stack

- Frontend: React, Vite, TypeScript, Framer Motion, Lucide
- Backend: Node.js, Express, TypeScript
- Auth + DB: Supabase
- Monorepo: npm workspaces

## Project Structure

```text
ecommerce app/
├── client/                  # React app
├── server/                  # Express API
├── shared/                  # Shared TS types
├── supabase/migrations/     # SQL migrations
├── package.json             # Workspace scripts
└── .gitignore
```

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- Supabase project (for auth/database)

## Environment Variables

Create local env files from examples:

- `client/.env.example` -> `client/.env` (or use root `.env` because Vite is configured with `envDir: ".."`).
- `server/.env.example` -> `server/.env`

Required client vars:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Required server vars:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
RESEND_API_KEY=your_resend_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

Important security note:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Never prefix service role keys with `VITE_`.

## Install

From repository root:

```bash
npm install
```

## Run Locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:server
```

## Build

Build all workspaces:

```bash
npm run build
```

## Supabase Migrations

Migrations are in `supabase/migrations/`:

- `20260414133000_auth_and_profiles.sql`
- `20260414133100_ecommerce_core.sql`

Apply with Supabase CLI:

```bash
supabase db push
```

## Auth Flows Implemented

- Email/password sign in
- Email/password sign up
- Google OAuth sign in/up
- Password reset email flow
- Supabase session listener + sign out

## GitHub Readiness Checklist

- `node_modules` ignored
- env files ignored (`.env`, `.env.*`)
- build artifacts ignored (`dist`, `build`, `coverage`)
- logs and editor temp files ignored
- committed env templates available (`.env.example`, `client/.env.example`, `server/.env.example`)

