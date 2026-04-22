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