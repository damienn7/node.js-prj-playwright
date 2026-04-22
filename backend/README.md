# Product Intelligence AI — Backend (V0)

Minimal backend API scaffold for Product Intelligence AI (V0).

Stack: Node.js, TypeScript, Express, Prisma, PostgreSQL

Getting started

1. Copy `.env.example` to `.env` and update `DATABASE_URL` and `PORT`.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start in development:

```bash
npm run dev
```

Build & run

```bash
npm run build
npm run start
```

API Endpoints
- POST /api/analyses — create analysis { url }
- GET /api/analyses — list analyses (pagination query `?page=&limit=`)
- GET /api/analyses/:id — get analysis details
- DELETE /api/analyses/:id — delete analysis
- PATCH /api/analyses/:id/status — update status { status }

Notes
- Validation: `zod` used for request payload validation (simple, robust).
- Prisma is used for persistence. See `prisma/schema.prisma`.
- Error handling: centralized middleware handles Prisma errors and other failures.

Playwright (V0 analysis)
- This project includes a simple Playwright-based analysis runner that is triggered automatically after creating an analysis (fire-and-forget).
- Install Playwright browsers after installing deps:

```bash
cd backend
npm install
npx playwright install
```

- Screenshots and outputs are stored under `outputs/<analysisId>/`.
- Limitations: local storage only, single-process runner, no external queue — suitable for V0 only.

For V0.2
- Add Playwright integration worker service that updates analyses statuses and stores screenshots.
- Add authentication/authorization.
- Add background queue for analysis processing.
