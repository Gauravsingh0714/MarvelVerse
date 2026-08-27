---
name: marvelverse-validation
description: Comprehensive validation protocol for MarvelVerse. Organizes validation into 4 proportional levels based on scope and risk, covering type checking, linter compliance, test suites, build checks, verification CLIs, and data protection safety.
---

# MarvelVerse Validation & Quality Assurance Skill

## Overview

This skill provides the authoritative validation protocol for the MarvelVerse monorepo. Validation requirements are organized into 4 proportional levels matching the scope and risk of changes.

---

## Proportional Validation Levels

Select the appropriate validation level based on the scope of changes made:

```text
LEVEL 1 — Small Isolated UI / Styling / Content Changes
  └── Run targeted typecheck & linter checks.

LEVEL 2 — Standard Feature Changes (Frontend/Backend Logic)
  └── Run typecheck, lint, and relevant frontend/backend test suites.

LEVEL 3 — Cross-Layer, API, Repository, or Data Changes
  └── Run typecheck, lint, test suites, production build, and API verification CLIs.

LEVEL 4 — Major Milestone or Release Readiness
  └── Run full validation protocol across all layers and CLIs.
```

---

## Level 1 — Small Isolated UI / Styling / Content Changes

Use for styling tweaks, copy updates, presentational component fixes, or isolated UI layout changes.

```bash
# Typecheck workspace projects
pnpm typecheck

# ESLint check
pnpm lint
```

---

## Level 2 — Standard Feature Changes

Use for new React hooks, frontend services, component state logic, or backend controller updates.

```bash
# Typecheck workspace projects
pnpm typecheck

# ESLint check
pnpm lint

# Run relevant test suite
pnpm --filter marvelverse-frontend test   # Frontend logic
pnpm --filter marvelverse-backend test    # Backend logic
```

---

## Level 3 — Cross-Layer, API, Repository, or Data Changes

Use when adding new API endpoints, modifying repository queries, extending shared schemas, or updating data services.

```bash
# Static checks
pnpm typecheck
pnpm lint

# Full test suite
pnpm test

# Test production build
pnpm build

# Verification CLIs
pnpm data:repository:verify   # Repository query layer
pnpm data:api:verify          # Backend REST API
pnpm frontend:api:verify      # Frontend API integration
```

---

## Level 4 — Major Milestone or Release Readiness

Use for milestone audits, final release checks, or major monorepo verification.

```bash
# Static checks & full test suite
pnpm typecheck
pnpm lint
pnpm test
pnpm build

# Pipeline & verification CLIs
pnpm data:canonical:verify
pnpm data:repository:verify
pnpm data:api:verify
pnpm frontend:api:verify

# Workspace hygiene & data integrity
git diff --check
git diff -- data/verified/
git status
```

---

## Data Protection Safety Protocol

**Core Rule: Never discard canonical data changes automatically.**

If `git diff -- data/verified/` indicates modifications under `data/verified/`, follow this mandatory evaluation procedure:

1. **Inspect the Diff:** Inspect the specific diff lines using `git diff -- data/verified/`.
2. **Determine Intent:**
   - **Genuinely Unintended Changes:** If formatting alterations, timestamp refreshes, or accidental edits occurred during non-data tasks, identify the specific affected file(s).
   - **Intentional Data Updates:** If changes represent intentional dataset expansion (e.g. adding new MCU entities), run the canonical verification pipeline (`pnpm data:canonical:verify`) to validate schemas, relationships, and verification gate rules.
3. **Targeted Recovery Only:** Only after confirming that specific changes are genuinely unintended, revert exclusively the identified affected file(s) (e.g. `git checkout HEAD -- data/verified/<path-to-specific-file>`). Never run broad discard commands without prior inspection and confirmation.

---

## Troubleshooting Guide

- **Typecheck Errors (`ts(2307)` / `ts(2339)`):**
  - Application source files use `frontend/tsconfig.json` (`src/`).
  - Frontend test files use `frontend/tsconfig.test.json` (`tests/`).
- **REST API Route Mismatches:**
  - Ensure static endpoints (`/movies/tmdb/:tmdbId`) are registered before dynamic parameterized routes (`/movies/:canonicalId`) in `backend/src/routes/v1/`.
