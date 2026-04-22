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

S3 storage (V0.2)
- This version adds optional upload of screenshots to Amazon S3 using AWS SDK v3.
- Configure AWS credentials and `AWS_S3_BUCKET` in your `.env` file. Optionally set `AWS_S3_PUBLIC_BASE_URL` to override object URLs.
- Uploaded objects follow the key format: `analyses/<analysisId>/step-<index>-<label>.png`.
- If S3 upload fails the local file is preserved and the analysis continues; `screenshotsJson` will contain either local `filePath` only or S3 metadata (`storage`, `s3Key`, `url`) when upload succeeds.
- Limitations of V0.2:
	- No CloudFront, no signed URLs, no lifecycle/cleanup.
	- Public access to objects depends on your bucket policy; ensure the bucket or objects are publicly readable if you want direct access.
	- Error handling is non-fatal for analysis runs; uploads are retried only at runtime (no background retry queue).


For V0.2
- Add Playwright integration worker service that updates analyses statuses and stores screenshots.
- Add authentication/authorization.
- Add background queue for analysis processing.
