# **Document 2 – Component Inventory & Architecture (CIA)**

**Project:** MarvelVerse – Interactive Marvel Cinematic Universe Explorer  
 **Version:** 1.0

---

# **1\. Objectives**

The component architecture should:

* Maximize reusability.  
* Avoid duplicate UI components.  
* Keep business logic out of presentation components.  
* Make components composable and testable.  
* Provide a single source of truth for Antigravity.  
  ---

  # **2\. Component Hierarchy**

We'll organize components into five layers:

* Application  
*     │  
*     ▼  
* Page Components  
*     │  
*     ▼  
* Feature Components  
*     │  
*     ▼  
* Shared Components  
*     │  
*     ▼  
  Primitive UI Components

  ### **Layer Responsibilities**

| Layer | Responsibility |
| ----- | ----- |
| Application | Routing, providers, layouts |
| Page | Assemble feature components into complete pages |
| Feature | Business-specific UI and logic |
| Shared | Reusable cross-feature components |
| Primitive UI | Basic design-system elements (Button, Card, Input, etc.) |

  ---

  # **3\. Primitive UI Components**

These are the building blocks. They **must not contain business logic**.

| Component | Variants |
| ----- | ----- |
| Button | Primary, Secondary, Ghost, Icon, Danger |
| Input | Text, Search, Password |
| TextArea | Standard |
| Select | Single, Multi |
| Checkbox | Standard |
| Radio | Standard |
| Switch | Toggle |
| Badge | Status, Category |
| Chip | Filter, Tag |
| Card | Elevated, Flat |
| Avatar | Small, Medium, Large |
| Tooltip | Top, Bottom, Left, Right |
| Modal | Center, Fullscreen |
| Drawer | Left, Right |
| Tabs | Horizontal |
| Accordion | Expandable |
| Skeleton | Card, List, Detail |
| Spinner | Small, Large |
| Divider | Horizontal, Vertical |

---

# **4\. Shared Layout Components**

These define page structure.

| Component | Purpose |
| ----- | ----- |
| Container | Max-width wrapper |
| Section | Vertical spacing |
| Grid | Responsive grid system |
| Stack | Vertical layout |
| Flex | Flexible alignment |
| PageWrapper | Standard page padding |
| HeroLayout | Hero section wrapper |

---

# **5\. Navigation Components**

| Component | Purpose |
| ----- | ----- |
| Navbar | Global navigation |
| MobileMenu | Mobile navigation |
| Sidebar | Future admin/favorites |
| Breadcrumb | Navigation path |
| SearchBar | Global search input |
| Footer | Global footer |

---

# **6\. Feedback Components**

| Component | Purpose |
| ----- | ----- |
| EmptyState | No content |
| ErrorState | API or page errors |
| LoadingState | Generic loading |
| Toast | Notifications |
| ConfirmDialog | User confirmation |

---

# **7\. Feature Components**

Each feature owns its specialized components.

---

## **Home**

* HeroSection  
* FeaturedCarousel  
* SagaOverview  
* LatestReleases  
* CharacterSpotlight  
* StatsSection  
  CTASection  
  ---

  ## **Movies**

* MovieCard  
* MovieGrid  
* MovieHero  
* MovieGallery  
* MovieStats  
* MovieCast  
* MovieTimeline  
* MovieActions  
  MovieMetadata  
  ---

  ## **Series**

* SeriesCard  
* SeriesGrid  
* EpisodeList  
* SeasonTabs  
* SeriesHero  
  SeriesCast  
  ---

  ## **Characters**

* CharacterCard  
* CharacterHero  
* PowerList  
* AbilityGrid  
* AppearanceTimeline  
* RelationshipList  
* TeamMembership  
  CharacterGallery  
  ---

  ## **Actors**

* ActorCard  
* ActorHero  
* Filmography  
* CharacterRoles  
  Biography  
  ---

  ## **Timeline**

* TimelineContainer  
* TimelineNode  
* TimelineConnector  
* TimelineFilter  
* TimelineLegend  
  TimelineEvent  
  ---

  ## **Search**

* SearchInput  
* SearchSuggestions  
* SearchFilters  
* SearchResults  
* ResultCard  
  ResultSection  
  ---

  ## **Teams**

* TeamCard  
* MemberGrid  
* TeamHero  
  TeamStats  
  ---

  ## **Organizations**

* OrganizationCard  
* OrganizationHero  
  OrganizationMembers  
  ---

  ## **Locations**

* LocationCard  
* LocationHero  
  LocationGallery  
  ---

  ## **Artifacts**

* ArtifactCard  
* ArtifactHero  
  ArtifactHistory  
  ---

  # **8\. Composite Components**

Composite components combine multiple primitives and shared components.

Examples:

* MovieHero  
* ├── HeroLayout  
* ├── Button  
* ├── Badge  
* ├── Metadata  
* └── BackgroundImage  
*   
* CharacterHero  
* ├── HeroLayout  
* ├── Avatar  
* ├── Stats  
* ├── ActionButtons  
  └── Biography

These should remain feature-specific.

---

# **9\. Component Rules**

### **Primitive Components**

* No API calls.  
* No business logic.  
* No routing.  
* Styling only.

  ### **Shared Components**

* Reusable across multiple features.  
* Accept data via props.  
* No feature-specific assumptions.

  ### **Feature Components**

* May use feature hooks.  
* May consume feature services.  
* Should not call APIs directly if hooks/services already exist.

  ### **Page Components**

* Compose the page.  
* Coordinate layout.  
* Delegate logic to hooks and feature components.  
  ---

  # **10\. Props Guidelines**

Every component should have:

* Clearly typed props.  
* Minimal required props.  
* Sensible defaults.  
* No prop drilling beyond two levels (use context when appropriate).

Example:

* interface MovieCardProps {  
*   movie: Movie;  
*   variant?: "default" | "compact";  
*   onClick?: () \=\> void;  
  }  
  ---

  # **11\. Component Naming**

* PascalCase for components.  
* Descriptive names.  
* Avoid generic names like `Card2` or `NewButton`.

Good:

* `MovieCard`  
* `CharacterHero`  
* `TimelineNode`

Bad:

* `CardNew`  
* `Hero2`  
* `CompA`  
  ---

  # **12\. Reuse Strategy**

Before creating a component, Antigravity must check:

1. Does a primitive UI component already exist?  
2. Can an existing shared component be composed?  
3. Can the feature component be extended with variants?  
4. Only then create a new component.  
   ---

   # **13\. State Ownership**

| Component Type | Own State? |
| ----- | ----- |
| Primitive | Local UI state only |
| Shared | Minimal UI state |
| Feature | Feature-specific state |
| Page | Page coordination state |

Business data should be managed by hooks or state libraries, not by UI components.

---

# **14\. Accessibility Rules**

Every interactive component must:

* Support keyboard navigation.  
* Display visible focus indicators.  
* Include ARIA labels where needed.  
* Respect reduced-motion preferences.  
* Maintain sufficient color contrast.  
  ---

  # **15\. Performance Guidelines**

* Memoize expensive components where appropriate.  
* Lazy load heavy sections (e.g., galleries).  
* Virtualize long lists if necessary.  
* Avoid unnecessary re-renders.  
  ---

  # **16\. Animation Ownership**

Animations should be added **around** components, not embedded into primitive components.

Example:

* `MovieCard` defines structure and styles.  
* `AnimatedMovieCard` (or page-level wrapper) applies Framer Motion or GSAP effects.

This keeps primitives reusable and prevents animation logic from leaking into the design system.

---

# **17\. Component Dependency Rules**

Allowed:

* Page  
*   ↓  
* Feature  
*   ↓  
* Shared  
*   ↓  
  Primitive

Not Allowed:

* Primitive → Feature  
* Shared → Page  
* Feature → Another Feature (unless through a shared abstraction)

This prevents circular dependencies.

---

# **18\. Antigravity Development Rules**

Antigravity should follow these rules:

1. Never duplicate an existing component.  
2. Extend with variants before creating new components.  
3. Keep primitive components framework-agnostic where possible.  
4. Separate styling, logic, and data fetching.  
5. Prefer composition over inheritance.  
6. Add Storybook-style usage examples in comments if requested.  
7. Do not modify shared components without checking impact on dependent features.  
   ---

   # **19\. Future Expansion**

The architecture supports future modules like:

* Authentication  
* User Profiles  
* Favorites  
* Watchlists  
* AI Assistant  
* Admin Dashboard

without changing the existing component hierarchy.

---

# **20\. Approval Checklist**

Please review and approve:

* Component hierarchy  
* Primitive component inventory  
* Shared component inventory  
* Feature component inventory  
* Reuse strategy  
* State ownership rules  
* Accessibility guidelines  
* Animation ownership  
* Dependency rules  
* Antigravity development rules  
* 

