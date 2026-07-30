# **Document 6 – Content Schema & Dataset Specification (CSDS)**

**Project:** MarvelVerse – Interactive Marvel Cinematic Universe Explorer  
 **Version:** 1.0

---

# **1\. Purpose**

The Content Schema defines:

* Every content entity.  
* Required and optional fields.  
* Relationships.  
* Validation rules.  
* Asset naming.  
* Slug conventions.  
* JSON file structure.  
* Seed process.

This document is the **single source of truth** for MarvelVerse content.

---

# **2\. Content Pipeline**

Research Sources

        │

        ▼

Raw Content

        │

        ▼

Structured JSON

        │

        ▼

Validation

        │

        ▼

Prisma Seed

        │

        ▼

PostgreSQL

        │

        ▼

REST API

        │

        ▼

React Frontend

---

# **3\. Dataset Folder Structure**

data/

│

├── sagas/

│   └── sagas.json

│

├── phases/

│   └── phases.json

│

├── titles/

│   ├── movies.json

│   ├── series.json

│   └── specials.json

│

├── characters/

│   └── characters.json

│

├── actors/

│   └── actors.json

│

├── teams/

│   └── teams.json

│

├── organizations/

│   └── organizations.json

│

├── locations/

│   └── locations.json

│

├── artifacts/

│   └── artifacts.json

│

├── events/

│   └── events.json

│

├── relationships/

│   └── relationships.json

│

└── assets.json

---

# **4\. Slug Rules**

Every entity must have a unique slug.

Examples:

iron-man

captain-america

avengers-endgame

wanda-maximoff

shield

wakanda

Rules:

* Lowercase  
* Hyphen-separated  
* No spaces  
* No special characters  
* Never change after publication  
  ---

  # **5\. Asset Naming Rules**

Example:

assets/

movies/

iron-man/

poster.jpg

backdrop.jpg

logo.png

gallery/

01.jpg

02.jpg

characters/

iron-man/

profile.png

banner.jpg

teams/

avengers/

logo.png

Consistent naming simplifies asset loading.

---

# **6\. Entity Schemas**

## **Saga**

Required:

* id  
* name  
* slug  
* description  
* order

Optional:

* banner  
* logo  
* themeColor  
  ---

  ## **Phase**

Required:

* id  
* sagaId  
* name  
* slug  
* order

Optional:

* description  
* banner  
  ---

  ## **Movie**

Required:

* id  
* title  
* slug  
* phaseId  
* releaseDate  
* runtime  
* overview  
* poster  
* backdrop

Optional:

* trailer  
* budget  
* boxOffice  
* director  
* writers  
* producers  
* musicComposer  
* cinematographer  
* studio  
* imdbRating  
* rottenTomatoes  
* metacritic

Relationships:

* Characters  
* Actors  
* Events  
* Locations  
* Artifacts  
  ---

  ## **Series**

Required:

* id  
* title  
* slug  
* releaseDate  
* overview  
* poster

Optional:

* seasonCount  
* episodeCount  
* finaleDate

Relationships:

Same as Movie.

---

## **Character**

Required:

* id  
* name  
* slug  
* biography  
* status

Optional:

* alias  
* gender  
* species  
* origin  
* powers  
* abilities  
* weapons  
* affiliations  
* quote  
* profileImage  
* bannerImage

Relationships:

* Actor  
* Team  
* Organization  
* Movies  
* Series  
* Events  
* Artifacts  
* Locations  
  ---

  ## **Actor**

Required:

* id  
* name  
* slug

Optional:

* biography  
* birthday  
* nationality  
* profileImage  
* socialLinks

Relationships:

* Characters  
* Movies  
* Series  
  ---

  ## **Team**

Required:

* id  
* name  
* slug

Optional:

* logo  
* headquarters  
* founded

Relationships:

* Members  
* Movies  
* Events  
  ---

  ## **Organization**

Required:

* id  
* name  
* slug

Relationships:

* Members  
* Events  
  ---

  ## **Location**

Required:

* id  
* name  
* slug

Optional:

* planet  
* universe  
* description  
* image

Relationships:

* Movies  
* Events  
* Characters  
  ---

  ## **Artifact**

Required:

* id  
* name  
* slug

Optional:

* description  
* image  
* powers

Relationships:

* Characters  
* Movies  
* Events  
  ---

  ## **Event**

Required:

* id  
* name  
* slug  
* chronologicalOrder

Optional:

* date  
* description  
* image

Relationships:

* Characters  
* Movies  
* Teams  
* Locations  
  ---

  # **7\. Relationship Rules**

Every relationship should reference **IDs**, not names.

Example:

{

  "characterIds": \[

    "char\_iron\_man",

    "char\_pepper\_potts"

  \]

}

This prevents issues if names change.

---

# **8\. Required vs Optional Fields**

Rules:

* Required fields must always exist.  
* Optional fields may be `null` or omitted.  
* Never use empty strings for missing data.  
  ---

  # **9\. Validation Rules**

Before seeding:

* Unique IDs  
* Unique slugs  
* Valid references  
* Required fields present  
* No duplicate relationships  
* Valid dates  
* Valid URLs for media  
  ---

  # **10\. JSON Formatting Standards**

* UTF-8 encoding.  
* 2-space indentation.  
* Arrays sorted where applicable.  
* Stable key ordering for easier diffs.  
  ---

  # **11\. Versioning the Dataset**

Add a metadata file:

{

  "version": "1.0.0",

  "lastUpdated": "2026-07-30",

  "source": "MarvelVerse Dataset"

}

---

# **12\. Seed Strategy**

The seed process should:

1. Insert Sagas.  
2. Insert Phases.  
3. Insert Movies/Series.  
4. Insert Characters.  
5. Insert Actors.  
6. Insert Teams.  
7. Insert Organizations.  
8. Insert Locations.  
9. Insert Artifacts.  
10. Insert Events.  
11. Create relationship records.

This order respects foreign-key dependencies.

---

# **13\. Dataset Growth Policy**

Adding new MCU content should require only:

1. Updating the relevant JSON file.  
2. Validating the dataset.  
3. Running the seed script.

No frontend changes should be required for new content.

---

# **14\. Asset Strategy**

Store only asset paths or URLs in the dataset.

Example:

{

  "poster": "/assets/movies/iron-man/poster.jpg"

}

The application decides how to resolve those paths.

---

# **15\. Content Quality Rules**

Every record should:

* Use consistent terminology.  
* Follow the same date format (ISO 8601).  
* Use the same naming conventions.  
* Include meaningful descriptions.  
* Avoid duplicate information across entities.  
  ---

  # **16\. Approval Checklist**

Please review and approve:

* Dataset folder structure  
* Entity schemas  
* Slug rules  
* Asset naming conventions  
* Relationship strategy  
* Validation rules  
* Seed order  
* Dataset versioning  
* Growth policy


