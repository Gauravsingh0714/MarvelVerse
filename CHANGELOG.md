# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Character and movie detail pages with full relationship graph visualization
- Global search across movies, series, characters, and appearances
- Interactive character relationship network explorer
- Production deployment pipeline and E2E testing

---

## [3.0.0-dev] - 2026-11-02

### Added

#### Canonical Data & Catalog Expansions

- **Batch 16 (Asgardian Royalty):** Added canonical character records for Valkyrie (`mv-character-valkyrie-brunnhilde`) and Odin (`mv-character-odin-borson`).
- Added 7 canonical appearance relationships across _Thor_, _Thor: The Dark World_, _Thor: Ragnarok_, _Avengers: Endgame_, _Thor: Love and Thunder_, and _The Marvels_.
- **Daredevil: Born Again Season 2:** Added canonical season record `mv-season-daredevil-born-again-s2` (8 episodes, aired March–May 2026 on Disney+). Updated series metadata to 2 seasons and 17 episodes.
- **Batch 1 Phase 6 Reconciliations:** Created Peter Parker appearance in _Spider-Man: Brand New Day_, verified exact status and 139 min runtime. Updated theatrical runtimes for _Thunderbolts\*_ (127 min) and _The Fantastic Four: First Steps_ (115 min).
- **Batches 10–15:** Canonical catalog expansion covering foundational allies, Stark inner circle, Espionage & Strategic Defense characters, and Guardians of the Galaxy.
- Added Daredevil Seasons 1–3 canonical datasets.

#### Media Infrastructure & API

- Added TV series and season repository methods (`TvRepository`) and REST API routes (`/api/v1/series`, `/api/v1/series/:canonicalId`, `/api/v1/series/:seriesId/seasons`).
- Implemented `MediaResolver` and `MediaRepository` with secure asset fallback handling and TMDB provenance validation.
- Extended regression test suites across repository and API layers asserting referential integrity on 55 characters, 258 relationships, 42 movies, 12 series, and 16 seasons.

---

## [2.0.0-stage2] - 2026-08-23

### Added

#### Stage 2: Canonical Data, REST API & Frontend Integration

- Canonical data architecture with stable identifiers for Universes, Sagas, Phases, Movies, Characters, and Appearances.
- TMDB data acquisition, normalization, and validation pipeline.
- Versioned REST API (`/api/v1`) with centralized routing and error handling.
- Frontend API client, services (`foundationService`, `movieService`, `characterService`, `appearanceService`), and React Query hooks.
- Connected dynamic frontend views for Movies, Characters, and Timeline to canonical backend endpoints.

---

## [1.0.0-stage1] - 2026-08-10

### Added

#### Stage 1: Design System & Application Shell

- Google Stitch-inspired cinematic noir design system tokens and Tailwind CSS integration.
- Responsive application shell with navigation, layout header, footer, and fluid page transitions.
- Core UI primitive components and layout structures.

---

## [0.3.0] - 2026-07-30

### Added

#### Backend Foundation

- Initialized Express backend with TypeScript
- Configured Prisma ORM
- Configured PostgreSQL connection
- Added Zod environment validation
- Added centralized configuration layer
- Added Pino logging
- Added global error handling
- Added middleware pipeline
- Added health check endpoint
- Added project folder structure

---

## [0.2.0] - 2026-07-30

### Added

#### Frontend Foundation

- Initialized React application using Vite
- Configured TypeScript
- Configured Tailwind CSS
- Added React Router
- Added TanStack Query
- Added Zustand
- Added React Hook Form
- Added Zod
- Added Framer Motion
- Added GSAP
- Added Lenis
- Configured providers
- Configured routing
- Configured project structure

---

## [0.1.0] - 2026-07-30

### Added

#### Repository Foundation

- Created monorepo using pnpm workspaces
- Configured ESLint
- Configured Prettier
- Configured Husky
- Configured Commitlint
- Configured lint-staged
- Added shared TypeScript configuration
- Added GitHub workflows
- Added documentation structure
- Added repository configuration files
