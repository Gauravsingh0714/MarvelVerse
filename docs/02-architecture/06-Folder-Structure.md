# **Document 1 – Folder Structure Specification (FSS)**

**Project:** MarvelVerse – Interactive Marvel Cinematic Universe Explorer  
 **Version:** 1.0

---

# **1\. Objectives**

The folder structure should:

* Be scalable as new MCU entities are added.  
* Keep related files together (UI, API calls, hooks, types).  
* Minimize cross-feature dependencies.  
* Be easy for Antigravity to navigate.  
* Support future features (authentication, favorites, AI assistant, admin panel) without major restructuring.

---

# **2\. High-Level Repository Structure**

marvelverse/  
│  
├── frontend/          \# React application  
├── backend/           \# Express API  
├── shared/            \# Shared types, constants, schemas  
├── data/              \# JSON datasets & seed data  
├── docs/              \# PRD, TRD, FSS, API docs, etc.  
├── scripts/           \# Utility scripts (validation, import, migration)  
├── .github/           \# GitHub workflows  
└── README.md

### **Why?**

* **frontend/** and **backend/** are independently deployable.  
* **shared/** avoids duplicating types and enums.  
* **data/** supports the content pipeline.  
* **docs/** keeps all planning and architecture documents versioned.  
* **scripts/** centralizes one-off developer utilities.

---

# **3\. Frontend Structure**

frontend/  
├── public/  
├── src/  
│  
├── app/  
│   ├── router/  
│   ├── providers/  
│   ├── layouts/  
│   └── App.tsx  
│  
├── features/  
│  
├── components/  
│  
├── services/  
│  
├── hooks/  
│  
├── lib/  
│  
├── assets/  
│  
├── styles/  
│  
├── constants/  
│  
├── types/  
│  
├── utils/  
│  
└── main.tsx  
---

# **4\. Feature-Based Organization**

Every business feature gets its own module.

Example:

features/

home/

movies/

series/

characters/

actors/

timeline/

search/

teams/

locations/

artifacts/

organizations/

No business logic should live outside its feature unless it is truly reusable.

---

# **5\. Inside Every Feature**

Every feature follows the same pattern.

Example: `movies/`

movies/

components/

pages/

hooks/

services/

types/

utils/

constants/

index.ts

### **Responsibilities**

#### **components/**

Feature-specific UI.

Examples:

* MovieCard  
* MovieHero  
* MovieGallery  
* CastSection

---

#### **pages/**

Page-level composition.

Examples:

MovieListPage

MovieDetailPage  
---

#### **hooks/**

Examples:

useMovie()

useMovies()

useMovieFilters()  
---

#### **services/**

API calls only.

movie.service.ts  
---

#### **types/**

Movie-specific interfaces.

---

#### **utils/**

Formatting helpers.

---

#### **constants/**

Feature-specific constants.

---

# **6\. Shared Components**

Reusable UI belongs here.

components/

ui/

layout/

navigation/

feedback/  
---

## **UI**

Examples:

Button

Input

Modal

Badge

Avatar

Card

Tooltip

Skeleton

Spinner

Tabs

Accordion  
---

## **Layout**

Examples:

Container

Section

Grid

PageWrapper  
---

## **Navigation**

Navbar

Footer

Sidebar

Breadcrumb

SearchBar  
---

## **Feedback**

EmptyState

ErrorState

LoadingState

Toast  
---

# **7\. Assets**

assets/

images/

icons/

fonts/

animations/

videos/

Images should not be scattered inside feature folders unless they are feature-exclusive.

---

# **8\. Styles**

styles/

globals.css

tokens.css

animations.css

utilities.css

No component should define colors directly. Use design tokens.

---

# **9\. Services**

Global API clients.

services/

api.ts

queryClient.ts

auth.ts

Business services remain inside features.

---

# **10\. Backend Structure**

backend/

src/

modules/

middleware/

config/

database/

utils/

routes/

app.ts

server.ts  
---

# **11\. Backend Modules**

Mirror frontend features.

modules/

movies/

characters/

timeline/

search/

actors/

teams/

organizations/

Each module contains:

controller/

service/

repository/

routes/

validation/

types/  
---

# **12\. Shared Folder**

shared/

types/

schemas/

constants/

enums/

Examples:

* `TitleType`  
* `Status`  
* API response interfaces  
* Validation schemas

---

# **13\. Data Folder**

Supports the content pipeline.

data/

movies.json

series.json

characters.json

actors.json

events.json

teams.json

organizations.json

locations.json

artifacts.json

relationships.json

This folder is the single source of truth for seed data.

---

# **14\. Scripts Folder**

Developer automation.

scripts/

validateData.ts

seedDatabase.ts

generateSlugs.ts

syncAssets.ts  
---

# **15\. Naming Conventions**

### **Folders**

* lowercase  
* singular only if the feature is singular by nature; otherwise use plural (e.g., `movies`, `characters`).

### **Components**

* PascalCase

Example:

MovieCard.tsx

### **Hooks**

useMovies.ts

### **Services**

movie.service.ts

### **Types**

movie.types.ts

### **Constants**

movie.constants.ts  
---

# **16\. Import Rules**

Prefer absolute imports with aliases.

Example:

import { Button } from "@/components/ui";  
import { MovieCard } from "@/features/movies/components";

Avoid deep relative imports like:

../../../components/Button  
---

# **17\. Ownership Rules**

| Folder | Responsibility |
| ----- | ----- |
| `features/` | Business logic and feature-specific UI |
| `components/` | Shared reusable UI |
| `services/` | Global infrastructure services |
| `shared/` | Cross-project types and schemas |
| `data/` | Seed datasets |
| `scripts/` | Development tooling |

---

# **18\. Architecture Rules for Antigravity**

Antigravity must follow these rules:

1. Never create duplicate components.  
2. Prefer existing shared components before generating new ones.  
3. Keep business logic inside the relevant feature.  
4. Never place API calls directly in components.  
5. Keep pages focused on composition; move logic to hooks and services.  
6. Avoid circular imports between features.  
7. Reuse types from `shared/` whenever applicable.  
8. Do not modify another feature's internals without explicit instruction.

---

# **19\. Future-Proofing**

This structure is designed to accommodate future additions such as:

* `auth/`  
* `favorites/`  
* `watchlists/`  
* `recommendations/`  
* `admin/`  
* `ai-assistant/`

without requiring major reorganization.

---

# **20\. Approval Checklist**

Please review and approve:

* Repository layout  
* Frontend structure  
* Backend structure  
* Feature organization  
* Shared component strategy  
* Data and scripts folders  
* Naming conventions  
* Import rules  
* Antigravity architecture rules

