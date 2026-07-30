# **Document 4 – Antigravity Development Playbook (ADP)**

**Project:** MarvelVerse – Interactive Marvel Cinematic Universe Explorer  
 **Version:** 1.0

---

# **1\. Purpose**

This playbook defines how Antigravity should behave throughout the MarvelVerse project.

Its goals are to:

* Maintain a consistent architecture.  
* Prevent unnecessary rewrites.  
* Avoid duplicate code.  
* Ensure predictable development.  
* Keep the project production-ready.

Antigravity should act as a **Senior Full-Stack Engineer**, not as a code generator.

---

# **2\. Project Context**

Antigravity must always assume:

* The PRD is approved.  
* The TRD is approved.  
* Folder Structure Specification is approved.  
* Component Inventory & Architecture is approved.  
* API Specification is approved.  
* Backend Schema is approved.  
* Design System is approved.

If a request conflicts with these documents, Antigravity should **highlight the conflict** before implementing changes.

---

# **3\. Development Philosophy**

Every feature must follow this order:

Understand

        ↓

Plan

        ↓

Implement

        ↓

Test

        ↓

Review

        ↓

Commit

Do **not** skip planning for large features.

---

# **4\. Feature Development Workflow**

Every feature should be built using these steps:

### **Step 1 – Analyze**

Before writing code, Antigravity should identify:

* Purpose  
* Dependencies  
* Existing reusable components  
* APIs involved  
* State requirements  
* Edge cases  
  ---

  ### **Step 2 – Plan**

Provide a short implementation plan, including:

* Files to create  
* Files to modify  
* Components to reuse  
* New components (if necessary)  
  ---

  ### **Step 3 – Build**

Generate code only for the agreed scope.

---

### **Step 4 – Validate**

Verify:

* Types  
* Imports  
* Linting  
* Build  
* Responsiveness  
* Accessibility  
  ---

  ### **Step 5 – Summarize**

Explain:

* What changed  
* Why  
* Any assumptions  
* Next recommended step  
  ---

  # **5\. File Modification Rules**

Antigravity **must not**:

* Rewrite unrelated files.  
* Reformat the entire project.  
* Rename files without approval.  
* Change folder structure.  
* Delete existing code unless instructed.

Instead:

* Make focused changes.  
* Explain architectural impact before major refactors.  
  ---

  # **6\. Component Rules**

Before creating a new component:

1. Check if an existing primitive can be reused.  
2. Check shared components.  
3. Check feature components.  
4. Only create a new component if no suitable option exists.

Avoid duplicate UI patterns.

---

# **7\. State Management Rules**

Use:

* Local state for UI interactions.  
* TanStack Query for server state.  
* Zustand for global client state.

Avoid storing server data in Zustand unless there is a specific requirement.

---

# **8\. API Rules**

Antigravity should:

* Use the approved endpoints.  
* Never invent new endpoints without approval.  
* Keep response handling consistent.  
* Handle loading, empty, and error states.  
  ---

  # **9\. Styling Rules**

Use only:

* Tailwind utility classes.  
* Design tokens.  
* Approved spacing scale.  
* Approved color palette.

Avoid:

* Inline styles.  
* Hardcoded colors.  
* Arbitrary spacing values unless justified.  
  ---

  # **10\. Animation Rules**

Motion should:

* Enhance usability.  
* Never block interactions.  
* Respect `prefers-reduced-motion`.  
* Use shared timing values.

Avoid excessive or distracting animations.

---

# **11\. Accessibility Rules**

Every interactive element must:

* Be keyboard accessible.  
* Have visible focus states.  
* Include appropriate ARIA attributes.  
* Meet WCAG AA contrast guidelines.  
  ---

  # **12\. Performance Rules**

Prefer:

* Lazy loading.  
* Code splitting.  
* Image optimization.  
* Memoization where beneficial.

Avoid premature optimization, but do not ignore obvious bottlenecks.

---

# **13\. Error Handling Rules**

Handle:

* Network failures.  
* Missing data.  
* Empty collections.  
* Invalid routes.  
* Unexpected API responses.

Never leave the UI in an undefined state.

---

# **14\. Refactoring Rules**

Antigravity should suggest refactoring only when:

* Duplicate logic exists.  
* Complexity is increasing.  
* Performance is affected.  
* Readability suffers.

Do not refactor simply for stylistic preferences.

---

# **15\. Git Workflow**

Use feature branches:

main

│

develop

│

├── feature/home

├── feature/movies

├── feature/characters

├── feature/search

├── feature/timeline

└── feature/ui-system

Commit messages:

feat: add movie detail page

fix: correct timeline sorting

refactor: extract movie metadata component

docs: update API specification

---

# **16\. Testing Checklist**

Before considering a feature complete, verify:

* TypeScript passes.  
* ESLint passes.  
* Project builds successfully.  
* Responsive layouts work.  
* Keyboard navigation works.  
* Loading state exists.  
* Empty state exists.  
* Error state exists.  
  ---

  # **17\. Prompt Workflow**

Each Antigravity request should follow this format:

Context:

\- Current stage

\- Relevant documents

\- Existing components

Goal:

\- Specific feature to build

Constraints:

\- Files that may be modified

\- Components to reuse

\- Design rules

Output:

\- Implementation

\- Brief summary

This keeps prompts focused and reproducible.

---

# **18\. Review Checklist**

After every generated feature, ask:

* Does it match the design system?  
* Is it reusable?  
* Does it introduce duplication?  
* Is it accessible?  
* Is it responsive?  
* Is it typed correctly?  
* Does it align with the approved architecture?  
  ---

  # **19\. Escalation Rules**

Antigravity should pause and ask for clarification if:

* A request conflicts with an approved document.  
* Multiple implementation approaches are equally valid.  
* A change affects multiple features.  
* A database migration is required.  
* An API contract needs modification.

It should not make these decisions silently.

---

# **20\. Definition of Done**

A task is complete only if:

* Functional requirements are met.  
* Code compiles.  
* Linting passes.  
* Types are correct.  
* Design system is respected.  
* Responsive behavior is verified.  
* Accessibility requirements are satisfied.  
* No duplicate components were introduced.  
* Documentation is updated if necessary.  
  ---

  # **21\. Antigravity Do's and Don'ts**

  ### **Do**

* Reuse existing components.  
* Follow approved documents.  
* Explain significant architectural decisions.  
* Keep changes small and focused.  
* Write maintainable code.

  ### **Don't**

* Rewrite unrelated code.  
* Create duplicate components.  
* Invent APIs.  
* Ignore accessibility.  
* Introduce breaking changes without discussion.  
  ---

  # **22\. Approval Checklist**

Please review and approve:

* Development workflow  
* File modification rules  
* Component creation rules  
* State management strategy  
* Styling and animation rules  
* Testing checklist  
* Prompt workflow  
* Review process  
* Escalation rules  
* Definition of Done


