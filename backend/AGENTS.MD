# Backend agent instructions

- Stack: Node.js, TypeScript, Express, Prisma, PostgreSQL, Playwright
- Keep the implementation V0 and pragmatic
- Do not add Redis, queues, workers, auth, or S3 yet
- Keep controllers thin
- Keep Playwright logic inside dedicated services
- Store screenshots locally under outputs/<analysisId>/
- Update analysis status lifecycle correctly: queued -> running -> completed|failed
- Always close Playwright browser instances
- Preserve existing project architecture
- Ensure TypeScript build passes before considering the task done

# Storage integration rules

- Use AWS SDK v3
- Keep S3 integration simple and V0.2-oriented
- Do not add signed URLs yet
- Do not add CloudFront yet
- Do not refactor Prisma schema unless strictly necessary
- Keep screenshotsJson as the main storage structure for screenshot metadata
- Preserve local file path when useful for debugging
- If S3 upload fails, avoid crashing the whole analysis when possible
- Keep controllers thin and put S3 logic in a dedicated service