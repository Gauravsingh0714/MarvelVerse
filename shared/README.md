# @marvelverse/shared

Shared infrastructure package for the MarvelVerse monorepo.

This package is the **single source of truth** for all cross-cutting concerns consumed by both the frontend and backend.

## Usage

Import exclusively from the root entry point:

```ts
import type { ApiResponse, UUID, PaginatedResponse } from '@marvelverse/shared';
import { SortOrder, ErrorCode, UserRole } from '@marvelverse/shared';
import { paginationQuerySchema, emailSchema } from '@marvelverse/shared';
import {
  API_PREFIX,
  API_VERSION,
  DEFAULT_PAGE_SIZE,
} from '@marvelverse/shared';
import { ok, err, some, fromNullable } from '@marvelverse/shared';
```

## Structure

```
src/
├── contracts/   API response shapes, pagination contracts, query contracts
├── config/      Configuration type interfaces (framework-agnostic)
├── constants/   Compile-time constants: API, auth, pagination, regex, validation
├── enums/       Runtime-safe enums: roles, permissions, sort order, error codes
├── lib/         Reusable functional patterns: Result<T,E>, Maybe<T>
├── schemas/     Zod validation schemas organized by domain
│   ├── common/  UUID, pagination, sorting, search, ID params
│   └── auth/    Email, password, username
├── types/       Pure TypeScript interfaces and type aliases
│   ├── common/  Primitives: UUID, ISODateString, Nullable, DeepPartial
│   └── auth/    JwtPayload, RequestContext, UserSummary
├── utils/       Framework-agnostic pure utility functions
│   ├── array/
│   ├── date/
│   ├── object/
│   ├── pagination/
│   ├── sort/
│   ├── string/
│   └── type-guards/
└── index.ts     Single public API entry point
```

## Constraints

- ❌ No React imports
- ❌ No Express imports
- ❌ No Prisma imports
- ❌ No browser-specific globals
- ❌ No Node.js-specific APIs
- ✅ Framework-agnostic
- ✅ Zero side-effects
- ✅ Strict TypeScript (`no any`)
