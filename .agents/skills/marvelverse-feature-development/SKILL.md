---
name: marvelverse-feature-development
description: Full-stack feature development playbook for MarvelVerse Stage 3. Guides implementing new routes, pages, and components while respecting layer boundaries and preserving architectural contracts.
---

# MarvelVerse Stage 3 Feature Development Skill

## Overview

This skill defines the standard engineering workflow for adding new features, routes, components, and data integrations during Stage 3 of MarvelVerse.

MarvelVerse separates external data acquisition from canonical models, delivering data through a 6-layer architecture. Feature implementations must touch only the layers required for their specific scope, selecting the smallest appropriate abstraction boundary.

---

## The 6-Layer Full-Stack Architecture

When a feature introduces or modifies full-stack data flow, it must follow this established architecture without bypassing intermediate layers:

```text
1. Shared Contracts (@marvelverse/shared)
   └── Types & Zod Schemas (shared/src/types, shared/src/schemas)
        │
        ▼
2. Backend Repositories & DataLoader (backend/src/repositories)
   └── CanonicalDataLoader -> CanonicalCache -> Repositories -> CanonicalRepository
        │
        ▼
3. Backend Express REST API (backend/src/controllers, backend/src/routes/v1)
   └── Route Handlers, Zod Request Validators, Standard Response Envelopes (/api/v1)
        │
        ▼
4. Frontend Central API Client & Services (frontend/src/api, frontend/src/services)
   └── ApiClient -> Domain Services (MovieService, CharacterService, etc.)
        │
        ▼
5. React Async Query & Feature Hooks (frontend/src/hooks)
   └── Generic useApiQuery -> Feature Hooks (useMovies, useCharacters, etc.)
        │
        ▼
6. React UI Components & Page Routes (frontend/src/app/routes, frontend/src/app/router.tsx)
   └── Pages, Design System Components, Route Loading, Error Banners
```

---

## Proportional Scope & State Boundary Rules

Do not create unnecessary abstractions or modify layers prematurely. Select the smallest appropriate boundary:

- **Local UI State / Styling / Layout:** Local UI state (e.g. accordion toggle, active tab, modal visibility, local filter selection) remains inside Layer 6 components (`frontend/src/app/routes/`, `frontend/src/components/`). Do not create custom hooks or service layer changes for purely local component state.
- **Reusable Async Server-State or Feature Logic:** Reusable feature-level query state or server-data fetching should use established Layer 5 hook patterns (`useMovies`, `useCharacters`, `useApiQuery`). Do not write redundant custom hooks if existing feature hooks cover the query requirements.
- **New API Parameters or Endpoint Extensions:** Touch Layers 3, 4, 5, and 6 (`backend/src/controllers/`, `frontend/src/services/`, `frontend/src/hooks/`, UI routes).
- **New Canonical Entities or Schema Fields:** Touch all required layers from 1 through 6 (`@marvelverse/shared`, `backend/src/repositories/`, backend routes, frontend services, hooks, and UI routes).

---

## Core Architectural Rules & Constraints

1. **No Layer Bypassing:** When a feature involves backend server data, components must consume custom feature hooks. Never write raw `fetch()` or axios calls directly inside React components or pages.
2. **No Backend URL Leakage:** Frontend services must use the central `apiClient` instance (`frontend/src/api/client.ts`). Never hardcode backend URLs inside components or services.
3. **No Direct Filesystem / Data Access in Frontend:** Frontend code must never import or access `data/verified/` files directly. Backend API controllers must never read JSON files directly — they must query through `CanonicalRepository`.
4. **Canonical Data Protection:** Do not modify files under `data/verified/` during frontend or API-only feature work. If data modifications are intentional, verify them using the canonical verification pipeline (`pnpm data:canonical:verify`).
5. **Shared Type Safety:** Domain interfaces must be shared via `@marvelverse/shared`. Avoid duplicating interface or schema definitions across frontend and backend.
6. **Strict Response Envelopes:** All backend API responses must conform to standard JSON envelopes:
   - Success Single: `{ "data": { ... } }`
   - Success Collection: `{ "data": [ ... ], "meta": { "count": N } }`
   - Error: `{ "error": { "code": "...", "message": "..." } }`

---

## Implementation Checklist by Feature Scope

### A. UI-Only / Styling / Presentation Features

- [ ] Modified only relevant frontend components or route views under `frontend/src/`.
- [ ] Kept local component UI state encapsulated within Layer 6.
- [ ] Preserved existing design system tokens and AppShell layouts.
- [ ] Handled `RouteLoading` and safe error states.

### B. New Data-Driven Features or Routes

- [ ] Identified required layers (Shared $\rightarrow$ Backend $\rightarrow$ Frontend Services $\rightarrow$ Hooks $\rightarrow$ UI).
- [ ] Extended shared types in `@marvelverse/shared` if new schema fields were added.
- [ ] Placed static routes (`/movies/tmdb/:tmdbId`) before dynamic routes (`/movies/:canonicalId`).
- [ ] Registered lazy-loaded routes in `frontend/src/app/router.tsx` wrapped in `Suspense`.
- [ ] Verified change using proportional level in `marvelverse-validation` skill.
