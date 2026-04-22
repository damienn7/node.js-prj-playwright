# Product Intelligence AI — Frontend (V0)

Simple React + Vite frontend for the Product Intelligence AI backend (V0).

Prereqs
- Node.js 16+ and the backend running on `http://localhost:4000` (or set `VITE_API_BASE_URL`).

Install
```bash
cd frontend
npm install
```

Run (dev)
```bash
npm run dev
```

Build
```bash
npm run build
npm run preview
```

Configuration
- Copy `.env.example` to `.env` and update `VITE_API_BASE_URL` if needed.

Notes
- Minimal V0 frontend: no auth, no global state library, uses native fetch.
- Pages: Dashboard (`/`), Analyses (`/analyses`) and Analysis detail (`/analyses/:id`).
