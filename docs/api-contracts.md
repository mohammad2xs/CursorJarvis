# API Contracts Coverage

This document enumerates frontend API calls and their corresponding server routes under `src/app/api/*`.

Coverage is scanned by `scripts/check-api-coverage.mjs` and in CI via `.github/workflows/api-coverage.yml`.

Notes:
- In dev, some routes return mock payloads to ensure the UI never blocks when env/DB are missing.
- Add a stub API route before wiring integrations.

