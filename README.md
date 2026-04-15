# LuxeMart eCommerce App

LuxeMart is a full-stack ecommerce monorepo with a React + Vite client, Express API server, and Supabase for auth/data.

## Stack

- Frontend: React, TypeScript, Vite, React Router
- Backend: Node.js, Express, TypeScript
- Auth + DB: Supabase
- Monorepo: npm workspaces (`client`, `server`, `shared`)

## Repository Layout

```text
ecommerce-app/
├── client/                  # React app
├── server/                  # Express API
├── shared/                  # Shared TS types/constants
├── supabase/migrations/     # SQL migrations
├── package.json             # Root workspace scripts
└── README.md
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project

## Environment Setup

Create env files from templates:

- `client/.env.example` -> `client/.env`
- `server/.env.example` -> `server/.env`

Vite is configured with `envDir: ".."`, so root-level `.env` values can also be read by the client.

### Client vars

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server vars

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
RESEND_API_KEY=your_resend_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

Security notes:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
- Never prefix server secrets with `VITE_`.

## Install

```bash
npm install
```

## Development

Run client:

```bash
npm run dev
```

Run server:

```bash
npm run dev:server
```

## Quality Checks

Lint:

```bash
npm run lint
```

Tests:

```bash
npm run test
```

Build all workspaces:

```bash
npm run build
```

## Database Migrations

Migrations live in `supabase/migrations/`.

Apply migrations with Supabase CLI:

```bash
supabase db push
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Current pipeline validates:

- install (`npm ci`)
- lint (`npm run lint`)
- build (`npm run build`)
- test (`npm run test`)

