# Playwright Worker (V0)

This worker polls the Product Intelligence AI backend for queued analyses, runs Playwright to collect page data and screenshots, uploads screenshots to S3 and reports results back to the backend.

Prereqs
- Node.js 16+
- Backend running and reachable (`API_BASE_URL`)

Install

```bash
cd playwright-worker
npm install
```

Configure
- Copy `.env.example` to `.env` and set values:

- `API_BASE_URL` — backend URL (eg. http://localhost:4000)
- `WORKER_SHARED_TOKEN` — shared token used for internal endpoints
- `POLL_INTERVAL_MS` — polling when no job (ms)
- AWS credentials and `AWS_S3_BUCKET` if you want uploads to S3

Install Playwright browsers

```bash
npm run playwright:install
```

Run

Development (auto-reload):

```bash
npm run dev
```

Build

```bash
npm run build
npm run start
```

Behavior
- Claims jobs via `POST /api/internal/analyses/claim` using `WORKER_SHARED_TOKEN` in `Authorization` header.
- Reports success via `POST /api/internal/analyses/:id/complete` with collected JSON + `screenshotsJson`.
- Reports failure via `POST /api/internal/analyses/:id/fail`.
