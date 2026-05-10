# Digital Trade Compliance AI — Frontend (Next.js)

Decision-intelligence UI for the compliance operator workspace: **mounted `/api/v1` client**, typed contracts, fixtures, TanStack Query orchestration, Recharts, shadcn/ui. The experience emphasises **governance narratives, routing, and cohort posture** — not raw dataframe grids. See repo `frontend_api_contract.md`.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + enterprise dark theme tokens |
| UI | shadcn/ui (base-ui) |
| Server state | TanStack Query |
| Tables | TanStack Table (sort/filter review queue) |
| Charts | Recharts (severity + jurisdiction decision views) |
| Ingest | `papaparse` (CSV) + `read-excel-file/browser` (xlsx) |
| Motion | Framer Motion (subtle hydrated-surface ingress) |
| Client UI state | Zustand (`workflow-ui-store` — rail + pipeline subtext) |

## Local development

```bash
npm install
cp .env.example .env.local
# Backend (optional if NEXT_PUBLIC_USE_MOCK_API=true):
# FastAPI at http://localhost:8000 with /api/v1 mount
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — root redirects to `/dashboard`.

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | FastAPI origin without trailing slash. **Required on real Vercel production** (dev defaults to `http://localhost:8000`). Ignored for network I/O when mocks are on. |
| `NEXT_PUBLIC_USE_MOCK_API` | `true` → short-circuit transport; responses follow **real backend payload shapes** from `src/lib/mocks`. |
| `NEXT_PUBLIC_MOCK_PREFILL_RESULTS` | When mocks on, optionally hydrates `/results/latest` on first fetch with `MOCK_SCREENING_SUCCESS` (skips needing a pipeline run). |

### Upload → screen → hydrate pipeline

1. **`/upload`** — parse CSV/XLSX in-browser → **`POST /api/v1/datasets/upload/`** (ingest acknowledgement) → **`POST /api/v1/screening/run`** with full `records` JSON.
2. **TanStack Query** — latest screening payload cached under `queryKeys.latestResults()`; **`/dashboard`** and **`/review-queue`** render **derived** intelligence (no verbatim tabular dumps in primary surfaces).

### Mock fixtures (deterministic UI)

`src/lib/mocks/` ships:

- `screening-success.fixture.ts` / `MOCK_SCREENING_SUCCESS` — full envelope matching FastAPI scorer output.
- `screening-records.partial.ts` — realistic row telemetry for QA.
- Toggle **`NEXT_PUBLIC_USE_MOCK_API=true`** for frontend-only workflows (Storybook/component isolation friendly).

Ensure the API allows browser CORS when not using mocks (FastAPI middleware is permissive today).

## Deploying on Vercel

1. **Root Directory**: `frontend-web`.
2. Set `NEXT_PUBLIC_API_BASE_URL` to your API origin — or mocks for preview/demo sandboxes.

## Architecture map

```text
src/lib/mocks/            # Backend-shaped fixtures
src/lib/file-ingest/      # CSV / XLSX → records[]
src/lib/intelligence/decision/  # Pure derivation (themes, strata, fraud briefs)
src/lib/api/services/    # REST + mock branches
src/hooks/use-compliance-pipeline-mutation.ts
src/app/(platform)/upload|dashboard|review-queue
```

## Build verification

```bash
npm run build
npm run start
```

## Next steps

- OpenAPI codegen from `GET /api/v1/openapi.json` when schema stabilises.
- Server-persisted `workflow_id` + polling to replace optimistic rail timings.
