<div align="center">

# <img src="./design/stitch/branding/marvelverse_logo/readme-logo.png" alt="MarvelVerse Logo" height="40" valign="middle" /> MarvelVerse

An interactive cinematic Marvel Cinematic Universe (MCU) explorer built with a modern full-stack architecture. Discover movies, series, characters, actors, timelines, organizations, locations, artifacts, and their interconnected relationships through an immersive and visually rich experience.

![Status](https://img.shields.io/badge/status-active-success)
![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

</div>

---

## 📖 Project Overview

**MarvelVerse** is a production-grade full-stack web application designed to help fans explore the Marvel Cinematic Universe interactively.

Unlike traditional movie databases or wiki websites, MarvelVerse focuses on the **relationships** between every entity in the MCU. From the intricate chronological timeline to the interconnected web of characters, actors, teams, and locations, MarvelVerse aims to be the ultimate reference for MCU lore.

## 🎯 Project Goals

This repository serves as a portfolio-quality software engineering showcase demonstrating:

- **Modern React Architecture:** Utilizing React 19, Vite, and Zustand.
- **Scalable Node.js Backend:** Express combined with Prisma ORM and PostgreSQL.
- **Type-Safe Full-Stack Development:** End-to-end type safety with TypeScript and Zod.
- **Enterprise-Grade Structure:** Feature-first modular organization.
- **Clean System Design:** Adherence to SOLID principles and the Repository Pattern.
- **Modern UI/UX Practices:** Rich animations using Framer Motion, GSAP, and Lenis smooth scrolling.

## 🚀 Live Demo

_Coming soon..._

## 🖼️ Screenshots

_Application screenshots will be added after the first public release._

## 💎 Repository Highlights

The architecture is designed to reflect best practices used in large-scale open-source projects:

- **Feature-first Architecture:** Logic is grouped by feature domain rather than purely by file type.
- **Monorepo Structure:** Managed efficiently using `pnpm` workspaces.
- **TypeScript:** 100% strict type coverage across frontend, backend, and shared libraries.
- **Database:** PostgreSQL modeled safely with Prisma ORM.
- **Backend:** Express API structured in a layered architecture (Controllers, Services, Repositories).
- **Frontend:** Modern React 19 foundation optimized for performance.

## ✨ Features

- **🎬 Movies & Series:** Browse phases, ratings, release info, watch orders, and chronological orders.
- **🦸 Characters:** Deep-dive profiles including biographies, powers, affiliations, and appearances.
- **🎭 Actors:** Filmography tracking and character portrayals.
- **🛡️ Teams & Organizations:** Explore the Avengers, S.H.I.E.L.D., HYDRA, the TVA, and more.
- **🌍 Locations & Artifacts:** Discover everything from Wakanda and Asgard to the Infinity Stones.
- **🕒 Timeline:** Navigate an interactive, scrubbable MCU timeline.
- **🔍 Global Search:** Powerful unified search across the entire universe.

## 🏗️ Architecture

MarvelVerse follows a modern monorepo setup ensuring clear separation of concerns while maximizing code sharing.

```text
MarvelVerse
├── frontend/          # React 19 + Vite UI application
├── backend/           # Express + TypeScript API server
├── shared/            # Shared DTOs, types & utility functions
├── docs/              # System architecture & design documents
├── design/            # UI/UX assets and prototypes
└── .github/           # GitHub Actions workflows & templates
```

## 🛠️ Technology Stack

**Frontend:**
React 19 • TypeScript • Vite • Tailwind CSS • React Router • TanStack Query • Zustand • React Hook Form • Zod • Framer Motion • GSAP • Lenis

**Backend:**
Node.js • Express • TypeScript • Prisma ORM • PostgreSQL • Zod • Pino

**Development & Tooling:**
pnpm Workspaces • ESLint • Prettier • Husky • Commitlint • lint-staged

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Gauravsingh0714/MarvelVerse.git
   cd MarvelVerse
   ```

2. Install dependencies across the workspace:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   > Copy the provided `.env.example` files (in both `frontend/` and `backend/`) to `.env` and configure the required environment variables before running the project.

### Development

Start the frontend application:

```bash
pnpm --filter frontend dev
```

Start the backend API server:

```bash
pnpm --filter backend dev
```

**Available Global Scripts:**

- `pnpm lint`: Run ESLint across all workspaces.
- `pnpm typecheck`: Run TypeScript compilation checks.
- `pnpm build`: Create a production build of all applications.

## 📚 Documentation

Extensive project documentation can be found inside the [`docs/`](./docs) directory.

Key documentation folders:

- **[Architecture](./docs/02-architecture)** - Folder structure, component design, schema mapping.
- **[Design](./docs/04-design)** - Design system, UI patterns, and styling rules.
- **[Development](./docs/03-development)** - Engineering handbooks and development playbooks.
- **[Planning](./docs/01-planning)** - PRDs, Technical Requirements, and ADrs.

## 🗺️ Roadmap

Upcoming milestones include:

- Shared Infrastructure setup
- Design System integration
- Application Shell construction
- Content Management & Search Engine implementation
- Timeline Explorer & Relationship Graph development
- Motion & Animation pass
- E2E Testing & Deployment

## 🤝 Contributing

Contributions are always welcome. Please read our guidelines before submitting issues or pull requests:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

⭐ If you find this project interesting, consider giving it a star!
