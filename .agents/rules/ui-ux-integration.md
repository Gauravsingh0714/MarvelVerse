---
name: ui-ux-integration
description: Project-level usage rules defining boundaries between MarvelVerse architecture and UI/UX Pro Max recommendations.
---

# UI/UX Pro Max Integration Rules for MarvelVerse

When using the `ui-ux-pro-max` skill for UI/UX design intelligence within the MarvelVerse repository, the following architectural boundaries and constraints MUST be strictly enforced:

## 1. MarvelVerse Architecture Takes Precedence

The `marvelverse-feature-development` playbook is the definitive authority on architectural boundaries. If `ui-ux-pro-max` recommends a pattern, library, or abstraction that conflicts with MarvelVerse's 6-Layer Full-Stack Architecture, MarvelVerse rules take strict precedence.

## 2. No Unauthorized Dependencies

`ui-ux-pro-max` often suggests adding external dependencies for common UI solutions (e.g., specific animation libraries, icon libraries like Phosphor/Heroicons, or utility libraries).

- **Rule:** Do NOT blindly install new dependencies recommended by the UI/UX skill.
- **Action:** First check the existing `package.json` for already approved and integrated tools (e.g., Lucide for icons). Utilize existing tools to accomplish the design intent. If a new dependency is absolutely required, it must be explicitly proposed to and approved by the user.

## 3. Respect Existing Design Tokens

MarvelVerse has an established design system and token structure (`frontend/src/design/tokens/`).

- **Rule:** When `ui-ux-pro-max` recommends specific color hex codes, spacing, or typography adjustments, you must map those recommendations to the existing MarvelVerse design tokens rather than hardcoding raw values or introducing conflicting token definitions.

## 4. State Management Boundaries

`ui-ux-pro-max` may recommend complex interaction states.

- **Rule:** Ensure all component UI state (local filter selection, modal visibility, toggles) remains encapsulated within Layer 6 (UI components/routes) per `marvelverse-feature-development`. Do not create custom service hooks or API extensions for purely local UI behaviors suggested by the design skill.

## Summary

Treat `ui-ux-pro-max` as a _consultative_ guide for design reasoning, accessibility, and visual polish, but execute its recommendations strictly within the boundaries of the established MarvelVerse engineering workflow.
