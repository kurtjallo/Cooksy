# Cooksy – Food Waste Reducer

A React/Tailwind frontend and Motoko backend that helps users turn leftover ingredients into recipes, track favorites, and keep a history of what they’ve added.

## Structure

- `frontend/` – Vite + React + TypeScript + Tailwind UI. Includes a mock browser-based backend for local development.
- `backend/` – Motoko canister with ingredient, recipe, and history logic (simulated AI endpoints included).
- `spec.md` – Feature requirements and UI/UX expectations.

## Prerequisites

- Node.js 18+ (for the frontend).
- npm (comes with Node)
- (Optional) dfx & Motoko toolchain if you want to run the real canister instead of the mock.

## Frontend (mock backend) – Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open the printed localhost URL. Data persists in your browser’s localStorage via the mock actor.

## Frontend – Production Build

```bash
cd frontend
npm run build
npm run preview
```

## Backend (Motoko)

> Note: The frontend currently talks to a mock actor. To wire up the real canister, replace `createMockActor()` in `frontend/src/hooks/useActor.tsx` with your generated actor and agent setup.

Typical dfx flow:

```bash
cd backend
# dfx start --clean   # run in another terminal
# dfx deploy
```

## Paths to Know

- Hero image: `frontend/ahmet-koc-ewXGkFeh2FI-unsplash.jpg` (referenced in `frontend/src/pages/HomePage.tsx`)
- Layout shell: `frontend/src/components/Layout.tsx`
- Queries/hooks: `frontend/src/hooks/useQueries.ts`
- Mock backend: `frontend/src/backend.ts`

## Notes

- npm reports 2 moderate vulnerabilities; run `npm audit` if you want details.
- The mock backend stores ingredients/recipes/history locally; refreshing keeps your data.
