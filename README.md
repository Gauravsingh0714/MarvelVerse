# 🦸 MarvelVerse

> An interactive cinematic Marvel Cinematic Universe (MCU) explorer built with a modern full-stack architecture. Discover movies, series, characters, actors, timelines, organizations, locations, artifacts, and their interconnected relationships through an immersive and visually rich experience.

![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

---

# 📖 Project Overview

MarvelVerse is a production-grade full-stack web application that allows users to explore the Marvel Cinematic Universe in an interactive way.

Unlike traditional movie databases or wiki websites, MarvelVerse focuses on relationships between every entity in the MCU.

Users will be able to:

- Explore every MCU Saga and Phase
- Browse Movies and Disney+ Series
- Discover Characters and Actors
- Navigate the MCU Timeline
- Explore Teams and Organizations
- View Locations and Artifacts
- Search across the entire universe
- Visualize relationships between entities

The project is designed as a portfolio-quality software engineering project emphasizing scalability, maintainability, and modern development practices.

---

# ✨ Planned Features

## 🎬 Movies & Series

- Movie pages
- TV Series pages
- Ratings
- Release information
- Watch order
- Chronological order

## 🦸 Characters

- Character profiles
- Biography
- Powers
- Affiliations
- Relationships
- Appearances

## 🎭 Actors

- Actor profiles
- Filmography
- Character portrayals

## 🛡 Teams

- Avengers
- Guardians of the Galaxy
- Illuminati
- Thunderbolts
- Young Avengers
- and more...

## 🏛 Organizations

- S.H.I.E.L.D.
- HYDRA
- TVA
- Stark Industries
- Damage Control
- Wakandan Government

## 🌍 Locations

- Earth
- Wakanda
- Asgard
- Knowhere
- Kamar-Taj
- Quantum Realm
- Multiverse locations

## 💎 Artifacts

- Infinity Stones
- Mjolnir
- Stormbreaker
- Ten Rings
- Darkhold
- Eye of Agamotto

## 🕒 Timeline

Interactive MCU timeline including

- Sagas
- Phases
- Events
- Movies
- Series

## 🔍 Search

Global search supporting

- Movies
- Characters
- Actors
- Teams
- Organizations
- Locations
- Artifacts

---

# 🏗 Architecture

MarvelVerse follows a modern monorepo architecture.

```
MarvelVerse
│
├── frontend/          React + Vite
├── backend/           Express + TypeScript
├── shared/            Shared types & utilities
├── docs/              Project documentation
├── design/            UI/UX assets
└── .github/           GitHub workflows
```

The architecture follows:

- Feature-first organization
- SOLID principles
- Repository Pattern
- Layered Architecture
- REST API
- Type-safe development

---

# 🛠 Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Framer Motion
- GSAP
- Lenis

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Pino

## Development

- pnpm Workspaces
- ESLint
- Prettier
- Husky
- Commitlint
- lint-staged

---

# 📂 Repository Structure

```
.
├── backend/
├── frontend/
├── shared/
├── docs/
├── design/
├── assets/
├── scripts/
└── .github/
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL

## Installation

```bash
git clone https://github.com/Gauravsingh0714/MarvelVerse.git

cd MarvelVerse

pnpm install
```

---

# ⚙ Environment Variables

Create the required `.env` files using the provided `.env.example` templates.

Example:

```env
DATABASE_URL=
PORT=
NODE_ENV=
FRONTEND_URL=
```

---

# 🧪 Development

Start the frontend

```bash
pnpm --filter frontend dev
```

Start the backend

```bash
pnpm --filter backend dev
```

Run lint

```bash
pnpm lint
```

Run type checking

```bash
pnpm typecheck
```

Create a production build

```bash
pnpm build
```

---

# 📚 Documentation

Project documentation can be found inside:

```
docs/
```

Including

- Product Requirements
- Technical Requirements
- Information Architecture
- Application Flow
- Design System
- Backend Schema
- Implementation Roadmap
- Architecture Decisions (ADR)

---

# 📈 Current Progress

| Stage                              | Status |
| ---------------------------------- | ------ |
| Repository Setup                   | ✅     |
| Stage 0.1 – Monorepo               | ✅     |
| Stage 0.2 – Frontend Bootstrap     | ✅     |
| Stage 0.3 – Backend Bootstrap      | ✅     |
| Stage 0.4 – Shared Infrastructure  | 🚧     |
| Stage 0.5 – Engineering Validation | ⏳     |
| Stage 1 – Design System            | ⏳     |
| Stage 2 – Application Shell        | ⏳     |
| Stage 3 – Feature Development      | ⏳     |

---

# 🗺 Roadmap

Upcoming milestones include:

- Shared Infrastructure
- Design System
- Application Shell
- Content Management
- Search Engine
- Timeline Explorer
- Relationship Graph
- Motion & Animations
- Testing
- Deployment

See `ROADMAP.md` for detailed planning.

---

# 🤝 Contributing

Contributions are welcome.

Please read:

- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md

before submitting issues or pull requests.

---

# 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

⭐ If you find this project interesting, consider giving it a star!
