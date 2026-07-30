# **Backend Schema Document**

## **Project: MarvelVerse – Interactive Marvel Cinematic Universe Explorer**

**Version:** 1.0

---

# **1\. Database Overview**

MarvelVerse contains highly relational data. A normalized relational database is the most suitable approach.

**Database:** PostgreSQL  
 **ORM:** Prisma

The schema follows these principles:

* Avoid duplicate data.  
* Use many-to-many relationships where appropriate.  
* Keep entities modular and extensible.  
* Ensure every entity can evolve independently.

---

# **2\. High-Level ER Diagram**

Saga

 │

 ├── Phase

 │      │

 │      └── Title

 │              ├── Movie

 │              ├── Series

 │              └── Special Presentation

 │

 ├──────────────┐

 │              │

Character     Actor

 │              │

 │              │

Team        Organization

 │              │

Location    Artifact

 │

Event

---

# **3\. Core Tables**

## **3.1 Saga**

Represents large MCU story arcs.

### **Fields**

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| description | Text |
| order | Integer |
| bannerImage | String |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## **3.2 Phase**

Belongs to a Saga.

| Field | Type |
| ----- | ----- |
| id | UUID |
| sagaId | FK |
| name | String |
| slug | String |
| description | Text |
| order | Integer |
| startYear | Integer |
| endYear | Integer |
| createdAt | Timestamp |
| updatedAt | Timestamp |

Relationship:

Saga

 1

 |

 N

Phase

---

## **3.3 Title**

Generic entity for all content.

Types:

* Movie  
* Series  
* Special Presentation

### **Fields**

| Field | Type |
| ----- | ----- |
| id | UUID |
| phaseId | FK |
| title | String |
| slug | String |
| type | Enum |
| overview | Text |
| runtime | Integer |
| releaseDate | Date |
| chronologicalOrder | Integer |
| imdbRating | Decimal |
| poster | String |
| backdrop | String |
| trailerUrl | String |
| status | Enum |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## **3.4 Character**

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| alias | String |
| biography | Text |
| species | String |
| gender | String |
| status | Enum |
| powers | JSON |
| abilities | JSON |
| image | String |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## **3.5 Actor**

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| biography | Text |
| birthDate | Date |
| nationality | String |
| image | String |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## **3.6 Team**

Examples:

* Avengers  
* Guardians  
* TVA

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| description | Text |
| logo | String |
| createdAt | Timestamp |

---

## **3.7 Organization**

Examples:

* SHIELD  
* HYDRA

Fields similar to Team.

---

## **3.8 Location**

Examples:

* Earth  
* Wakanda  
* Asgard

Fields:

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| description | Text |
| image | String |

---

## **3.9 Artifact**

Examples:

* Infinity Gauntlet  
* Tesseract

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| description | Text |
| image | String |

---

## **3.10 Event**

Examples:

* Battle of New York  
* Blip

| Field | Type |
| ----- | ----- |
| id | UUID |
| name | String |
| slug | String |
| description | Text |
| timelineOrder | Integer |
| dateLabel | String |

---

# **4\. Junction Tables**

Because MarvelVerse has many-to-many relationships, dedicated junction tables are required.

## **Character ↔ Title**

character\_titles

| Field |
| ----- |
| characterId |
| titleId |
| role |
| firstAppearance |

---

## **Character ↔ Team**

character\_teams

---

## **Character ↔ Organization**

character\_organizations

---

## **Character ↔ Artifact**

character\_artifacts

---

## **Character ↔ Location**

character\_locations

---

## **Character ↔ Event**

character\_events

---

## **Title ↔ Event**

title\_events

---

## **Title ↔ Location**

title\_locations

---

## **Title ↔ Character**

Already covered.

---

## **Title ↔ Actor**

title\_actors

---

## **Team ↔ Event**

team\_events

---

# **5\. Relationship Graph**

Example:

Iron Man

↓

Appears In

↓

Iron Man

Avengers

Endgame

↓

Member Of

↓

Avengers

↓

Owns

↓

Mark 85 Armor

↓

Visited

↓

Titan

↓

Participated In

↓

Battle of Earth

The schema supports this without duplication.

---

# **6\. Enums**

## **TitleType**

MOVIE

SERIES

SPECIAL

---

## **Status**

ACTIVE

DECEASED

UNKNOWN

---

## **Alignment (Future)**

HERO

VILLAIN

ANTI\_HERO

NEUTRAL

---

# **7\. Primary Keys**

Every table uses:

UUID

Advantages:

* Globally unique  
* Better for distributed systems  
* Difficult to enumerate

---

# **8\. Foreign Keys**

Examples:

Phase.sagaId

Title.phaseId

CharacterTitle.characterId

CharacterTitle.titleId

All foreign keys enforce referential integrity.

---

# **9\. Index Strategy**

Indexes on:

* slug  
* releaseDate  
* chronologicalOrder  
* title  
* name  
* timelineOrder

Composite indexes:

phaseId \+ chronologicalOrder

titleId \+ characterId

characterId \+ eventId

---

# **10\. Search Optimization**

Prepare for future search by indexing:

* title  
* character name  
* actor name  
* team name  
* location name

Future integration with Meilisearch or Elasticsearch.

---

# **11\. Media Storage**

The database stores only references.

posterUrl

backdropUrl

galleryUrls

thumbnailUrls

Images themselves should reside in cloud object storage.

---

# **12\. Audit Fields**

Every major table should include:

| Field |
| ----- |
| createdAt |
| updatedAt |
| createdBy (Future) |
| updatedBy (Future) |

---

# **13\. Soft Delete**

Instead of deleting records:

deletedAt

isDeleted

This allows recovery and preserves relationships.

---

# **14\. Permissions**

## **Visitor**

* Read-only access.

## **Admin**

* CRUD operations for all entities.

Future roles:

* Editor  
* Moderator

---

# **15\. Ownership Rules**

Current Version:

All content is system-owned.

Future:

User-created collections, favorites, and watchlists will be owned by individual users.

---

# **16\. Session Management (Future)**

If authentication is added:

* JWT access tokens.  
* Refresh tokens.  
* Secure HTTP-only cookies (where applicable).  
* Session revocation support.

---

# **17\. Backup Strategy**

* Daily automated database backups.  
* Point-in-time recovery (if supported by the provider).  
* Weekly backup verification.

---

# **18\. Scalability**

The schema is designed to support:

* New MCU phases  
* Additional sagas  
* Future movies and series  
* Animated content  
* User accounts  
* Collections  
* AI recommendations  
* Expanded entity types

without restructuring existing tables.

---

# **19\. Data Integrity Rules**

* Every Phase belongs to one Saga.  
* Every Title belongs to one Phase.  
* Every slug must be unique.  
* Deleting a parent record must not orphan child records.  
* Junction tables must reference valid entities only.  
* Timeline order should be unique within its defined context.

---

# **20\. Backend Schema Validation Checklist**

Please review and approve:

* Core entity tables  
* Junction tables  
* Relationships  
* Primary and foreign keys  
* Index strategy  
* Media storage approach  
* Audit fields  
* Soft delete policy  
* Permissions  
* Ownership rules  
* Scalability design

