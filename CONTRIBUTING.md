# Contributing to MarvelVerse

First off, thank you for taking the time to contribute to MarvelVerse! 🎉

Whether you're fixing a bug, improving documentation, suggesting a feature, or submitting code, your contributions are greatly appreciated.

This document outlines the workflow and standards used throughout the project to help maintain a clean, consistent, and scalable codebase.

---

# Project Philosophy

MarvelVerse is built with the following principles in mind:

- Clean and maintainable architecture
- Type-safe development
- Scalable project structure
- Consistent coding standards
- Modern development practices
- High-quality documentation

Every contribution should strive to improve the project while keeping the codebase simple, readable, and maintainable.

---

# Prerequisites

Before contributing, make sure you have:

- Node.js 20 or later
- pnpm
- PostgreSQL
- Git

---

# Getting Started

Clone the repository:

```bash
git clone https://github.com/Gauravsingh0714/MarvelVerse.git
```

Move into the project:

```bash
cd MarvelVerse
```

Install dependencies:

```bash
pnpm install
```

Copy the provided `.env.example` files and configure your local environment before running the project.

Start development:

Frontend

```bash
pnpm --filter frontend dev
```

Backend

```bash
pnpm --filter backend dev
```

---

# Repository Structure

```
frontend/     React application

backend/      Express API

shared/       Shared types and utilities

docs/         Architecture and documentation

design/       Design assets

.github/      GitHub workflows and templates
```

---

# Branch Naming

Use descriptive branch names.

Examples:

```
feature/search

feature/timeline

feature/characters

fix/api-error

fix/navbar

docs/readme

refactor/logger

chore/dependencies
```

---

# Commit Messages

This project follows the Conventional Commits specification.

Examples:

```
feat: add timeline filters

fix: resolve character search bug

docs: update README

refactor: simplify logger configuration

build: configure backend bootstrap

test: add search service tests

chore: update dependencies
```

---

# Coding Standards

Please follow these guidelines:

- Write TypeScript wherever possible.
- Follow the existing project structure.
- Keep functions focused and small.
- Use descriptive names.
- Avoid duplicated logic.
- Keep components reusable.
- Prefer composition over inheritance.
- Follow ESLint and Prettier rules.
- Do not commit secrets or API keys.

---

# Before Submitting a Pull Request

Please ensure the following commands complete successfully:

```bash
pnpm lint
```

```bash
pnpm typecheck
```

```bash
pnpm build
```

---

# Pull Requests

Before opening a Pull Request:

- Keep changes focused on a single feature or fix.
- Write meaningful commit messages.
- Update documentation if required.
- Include screenshots for UI changes.
- Ensure there are no lint or type errors.

---

# Reporting Issues

When reporting a bug, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots (if applicable)

Feature requests should clearly explain:

- The problem being solved
- Proposed solution
- Possible alternatives

---

# Code Review

Every contribution should be reviewed for:

- Code quality
- Readability
- Maintainability
- Performance
- Type safety
- Documentation updates

Constructive feedback is always encouraged.

---

# License

By contributing to MarvelVerse, you agree that your contributions will be licensed under the project's MIT License.

Thank you for helping improve MarvelVerse! 🚀
