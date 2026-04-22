# Product Intel

Monorepo for a V0 web product analysis platform.

The project is split into two main applications:

- `backend`: API responsible for launching analyses, storing results, generating structured outputs, and managing screenshots
- `frontend`: React application used to browse analyses and inspect details

The current goal of this repository is to provide a first usable version of the product with:

- website analysis from a target URL
- structured outputs in JSON and Markdown
- screenshots storage
- analysis history
- a detail page to inspect and download generated assets

---

## Repository structure

```bash
.
├── backend/
├── frontend/
└── README.md
