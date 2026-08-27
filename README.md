<div align="center">

# <img src="./design/stitch/branding/marvelverse_logo/readme-logo.png" alt="MarvelVerse Logo" height="40" valign="middle" /> MarvelVerse

An interactive Marvel Cinematic Universe explorer built with a modern full-stack TypeScript architecture.

![Status](https://img.shields.io/badge/status-active-success)
![Progress](https://img.shields.io/badge/progress-Stage%202%20Complete-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933)
![Language](https://img.shields.io/badge/language-TypeScript-3178C6)
![License](https://img.shields.io/badge/license-MIT-yellow)

</div>

---

## 📖 Project Overview

**MarvelVerse** is a full-stack application for exploring the Marvel Cinematic Universe through structured and interconnected data.

The project uses a canonical data architecture that separates external data sources from MarvelVerse's internal data model. Data is acquired, normalized, validated, verified, exposed through a REST API, and consumed by the frontend.

---

## 🚧 Current Progress

### Stage 2 Complete

| Stage   | Status      | Description                                                  |
| ------- | ----------- | ------------------------------------------------------------ |
| Stage 0 | ✅ Complete | Monorepo, repository tooling, frontend and backend bootstrap |
| Stage 1 | ✅ Complete | Design system and application shell foundation               |
| Stage 2 | ✅ Complete | Canonical data, REST API, and frontend API integration       |
| Stage 3 | 🔜 Next     | Feature development                                          |

Current release milestone:

```text
v2.0.0-stage2
```

---

## ✨ Implemented Features

### Canonical Data Architecture

The project currently supports canonical models for:

- Universes
- Sagas
- Phases
- Movies
- Characters
- Character appearances

Each entity uses stable internal identifiers, for example:

- `mv-movie-iron-man`
- `mv-character-tony-stark`

### TMDB Data Pipeline

Stage 2 introduced a pipeline for:

- Data acquisition
- Data normalization
- Data validation
- Canonical dataset verification

### REST API

MarvelVerse exposes canonical data through a versioned REST API.

```text
/api/v1/universes
/api/v1/sagas
/api/v1/phases

/api/v1/movies
/api/v1/movies/:canonicalId
/api/v1/movies/tmdb/:tmdbId
/api/v1/movies/:movieId/appearances

/api/v1/characters
/api/v1/characters/:canonicalId
/api/v1/characters/tmdb/:tmdbId
/api/v1/characters/:characterId/appearances

/api/v1/appearances
/api/v1/appearances/:canonicalId
```

### Frontend API Integration

The frontend includes:

- API client
- Foundation service
- Movie service
- Character service
- Appearance service
- `useApiQuery`
- `useMovies`
- `useCharacters`
- `useFoundation`
- `useAppearances`

The following routes are connected to canonical API data:

- Movies
- Characters
- Timeline

---

## 🏗️ Architecture

```text
MarvelVerse
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── app/
│   └── tests/
│
├── backend/           # Express + TypeScript API
│   ├── src/
│   └── tests/
│
├── shared/            # Shared types and contracts
├── data/              # Canonical verified datasets
├── docs/              # Project documentation
├── design/            # Design assets
└── .github/           # GitHub workflows
```

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Zod
- Pino

### Tooling

- pnpm Workspaces
- ESLint
- Husky
- lint-staged
- Commitlint
- tsx

---

## 🧪 Quality Checks

The current project baseline passes:

- ✓ TypeScript typecheck
- ✓ ESLint
- ✓ Backend tests
- ✓ Frontend tests
- ✓ Production build
- ✓ Git whitespace validation

Current test results:

- **Backend:** 25 passing tests
- **Frontend:** 5 passing tests

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
git clone https://github.com/Gauravsingh0714/MarvelVerse.git
cd MarvelVerse
pnpm install
```

### Development

Run the frontend:

```bash
pnpm --filter marvelverse-frontend dev
```

Run the backend:

```bash
pnpm --filter marvelverse-backend dev
```

---

## 🔍 Available Commands

### Quality Checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### Data Verification

```bash
pnpm data:canonical:verify
pnpm data:repository:verify
pnpm data:api:verify
pnpm frontend:api:verify
```

### Frontend Tests

```bash
pnpm --filter marvelverse-frontend test
```

---

## 🏷️ Current Release

```text
v2.0.0-stage2
Stage 2 — Data, API and Frontend Integration Complete
```

This release includes:

- Canonical data model
- TMDB acquisition and normalization pipeline
- Data validation and verification
- Repository and query layer
- Versioned REST API
- Shared API contracts
- Frontend API client
- Service layer
- React data hooks
- Dynamic Movies page
- Dynamic Characters page
- Dynamic Timeline page
- Backend and frontend tests

---

## 🗺️ Roadmap

### Stage 3

- Movie detail pages
- Character detail pages
- Dynamic route integration
- Search functionality
- Additional filtering and sorting
- Appearance relationship visualization
- Richer UI integration

### Future

- Relationship graph
- Advanced timeline
- Additional MCU entities
- E2E testing
- Deployment
- Performance optimization

---

## 📚 Documentation

Project documentation is available in the [`docs/`](./docs) directory.

---

## 🤝 Contributing

Please review:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

⭐ If you find MarvelVerse interesting, consider giving the repository a star.

**Current Progress: Stage 2 Complete**

</div>
