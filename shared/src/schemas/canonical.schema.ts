import { z } from 'zod';

/**
 * MarvelVerse Canonical Entity Zod Schemas
 * Stage 2.6 / Batch 0 — Schema Hardening & Extension Points
 */

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const verificationStatusSchema = z.enum([
  'unverified',
  'verified',
  'rejected',
  'needs-review',
]);

export const verificationMetadataSchema = z.object({
  status: verificationStatusSchema,
  method: z
    .enum(['manual-review', 'curated-pipeline', 'automated-check'])
    .optional(),
  verifiedAt: z.string().datetime().optional(),
  verifiedBy: z.string().optional(),
  notes: z.string().optional(),
});

export const canonicalExternalIdsSchema = z
  .object({
    tmdb: z.number().int().positive().optional(),
    imdb: z.string().optional(),
  })
  .passthrough();

export const canonicalProvenanceSchema = z.object({
  provider: z.string().min(1),
  sourceId: z.union([z.number().int().positive(), z.string().min(1)]),
  sourceUri: z.string().optional(),
  method: z.string().optional(),
  acquiredAt: z.string().datetime().optional(),
});

// ----------------------------------------------------
// Media Architecture Schemas (Document 4 Section 5)
// ----------------------------------------------------

export const mediaAssetTypeSchema = z.enum([
  'poster',
  'backdrop',
  'avatar',
  'still',
  'banner',
  'logo',
]);

export const mediaAssetSchema = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  mediaType: mediaAssetTypeSchema,
  path: z.string().min(1),
  aspectRatio: z.string().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  altText: z.string(),
  attribution: z.string().nullable().optional(),
  entityType: z
    .enum(['movie', 'series', 'season', 'episode', 'character', 'variant'])
    .optional(),
  entityId: z.string().optional(),
});

export const mediaAvailabilitySchema = z.enum([
  'available',
  'unavailable',
  'missing',
  'pending',
]);

export const mediaSizeSchema = z.enum(['small', 'medium', 'large', 'original']);

export const resolvedMediaAssetSchema = z.object({
  assetId: z.string().min(1),
  provider: z.string().min(1),
  mediaType: mediaAssetTypeSchema,
  rawPath: z.string().nullable(),
  resolvedUrl: z.string().nullable(),
  size: mediaSizeSchema,
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  aspectRatio: z.string().optional(),
  altText: z.string(),
  attribution: z.string().nullable().optional(),
  availability: mediaAvailabilitySchema,
  fallbackUrl: z.string().nullable(),
  isFallback: z.boolean(),
  provenance: canonicalProvenanceSchema.optional(),
});

export const entityMediaBundleSchema = z.object({
  entityType: z.enum([
    'movie',
    'series',
    'season',
    'episode',
    'character',
    'variant',
  ]),
  entityCanonicalId: z.string().min(1),
  primaryPoster: resolvedMediaAssetSchema.nullable().optional(),
  primaryBackdrop: resolvedMediaAssetSchema.nullable().optional(),
  primaryAvatar: resolvedMediaAssetSchema.nullable().optional(),
  assets: z.array(resolvedMediaAssetSchema),
});

// ----------------------------------------------------
// Date & Chronology Schemas (Document 3 Section 7)
// ----------------------------------------------------

export const canonicalDateStatusSchema = z.enum([
  'exact',
  'approximate',
  'estimated',
  'unknown',
  'unreleased',
]);

export const datePrecisionSchema = z.enum([
  'day',
  'month',
  'year',
  'decade',
  'unknown',
]);

export const canonicalDateRecordSchema = z.object({
  rawDate: z.string().nullable(),
  status: canonicalDateStatusSchema,
  precision: datePrecisionSchema,
  source: z.string().optional(),
});

export const storyChronologySchema = z.object({
  storyYear: z.number().int().nullable().optional(),
  storyDate: z.string().nullable().optional(),
  precision: datePrecisionSchema.optional(),
  storyOrderIndex: z.number().int().positive().nullable().optional(),
  notes: z.string().optional(),
});

// ----------------------------------------------------
// Universe & Continuity Schemas (Document 3 Section 4)
// ----------------------------------------------------

export const continuityTierSchema = z.enum([
  'core-mcu',
  'connected-multiverse',
  'legacy-adjacent',
  'future-verified',
]);

export const canonicalContinuitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: continuityTierSchema,
  description: z.string().optional(),
});

export const canonicalUniverseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  continuityTier: continuityTierSchema.optional(),
});

export const canonicalSagaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().positive(),
});

export const canonicalPhaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  number: z.number().int().positive(),
  sagaId: z.string().min(1),
});

// ----------------------------------------------------
// Canonical Media Entity Schemas
// ----------------------------------------------------

export const canonicalMovieSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-movie-[a-z0-9-]+$/,
      'canonicalId must follow mv-movie-<slug> format'
    ),
  title: z.string().min(1, 'Movie title is required'),
  originalTitle: z.string().optional(),
  releaseDate: z.string().regex(isoDateRegex, 'releaseDate must be YYYY-MM-DD'),
  releaseDateRecord: canonicalDateRecordSchema.optional(),
  releaseOrder: z
    .number()
    .int()
    .positive('releaseOrder must be a positive integer'),
  chronology: storyChronologySchema.optional(),
  runtime: z.number().int().positive().nullable().optional(),
  overview: z.string(),
  posterPath: z.string().nullable().optional(),
  poster: mediaAssetSchema.nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  backdrop: mediaAssetSchema.nullable().optional(),
  genres: z.array(z.string()),
  universeId: z.string().min(1, 'universeId is required'),
  sagaId: z.string().min(1, 'sagaId is required'),
  phaseId: z.string().min(1, 'phaseId is required'),
  externalIds: canonicalExternalIdsSchema,
  provenance: canonicalProvenanceSchema,
  verification: verificationMetadataSchema,
});

export const canonicalTvSeriesSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-series-[a-z0-9-]+$/,
      'canonicalId must follow mv-series-<slug> format'
    ),
  title: z.string().min(1, 'TV series title is required'),
  originalTitle: z.string().optional(),
  firstAirDate: z
    .string()
    .regex(isoDateRegex, 'firstAirDate must be YYYY-MM-DD'),
  firstAirDateRecord: canonicalDateRecordSchema.optional(),
  lastAirDate: z
    .string()
    .regex(isoDateRegex, 'lastAirDate must be YYYY-MM-DD')
    .nullable()
    .optional(),
  chronology: storyChronologySchema.optional(),
  numberOfSeasons: z.number().int().nonnegative(),
  numberOfEpisodes: z.number().int().nonnegative(),
  overview: z.string(),
  posterPath: z.string().nullable().optional(),
  poster: mediaAssetSchema.nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  backdrop: mediaAssetSchema.nullable().optional(),
  genres: z.array(z.string()),
  universeId: z.string().min(1, 'universeId is required'),
  sagaId: z.string().min(1, 'sagaId is required'),
  phaseId: z.string().min(1, 'phaseId is required'),
  externalIds: canonicalExternalIdsSchema,
  provenance: canonicalProvenanceSchema,
  verification: verificationMetadataSchema,
});

export const canonicalEpisodeSchema = z.object({
  id: z.number().int(),
  canonicalId: z.string().optional(),
  episodeNumber: z.number().int().positive(),
  title: z.string().min(1),
  overview: z.string(),
  airDate: z.string().nullable().optional(),
  airDateRecord: canonicalDateRecordSchema.optional(),
  runtime: z.number().int().positive().nullable().optional(),
  stillPath: z.string().nullable().optional(),
  still: mediaAssetSchema.nullable().optional(),
});

export const canonicalSeasonSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-season-[a-z0-9-]+$/,
      'canonicalId must follow mv-season-<slug> format'
    ),
  tvCanonicalId: z.string().min(1),
  seasonNumber: z.number().int().nonnegative(),
  title: z.string().min(1),
  overview: z.string(),
  airDate: z.string().nullable().optional(),
  airDateRecord: canonicalDateRecordSchema.optional(),
  episodeCount: z.number().int().nonnegative(),
  episodes: z.array(canonicalEpisodeSchema),
  provenance: canonicalProvenanceSchema,
  verification: verificationMetadataSchema,
});

// ----------------------------------------------------
// Character & Variant Schemas (Document 3 Section 5)
// ----------------------------------------------------

export const canonicalCharacterSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-character-[a-z0-9-]+$/,
      'canonicalId must follow mv-character-<slug> format'
    ),
  name: z.string().min(1, 'Character name is required'),
  realName: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  species: z.string().optional(),
  overview: z.string().optional(),
  avatar: mediaAssetSchema.nullable().optional(),
  externalIds: canonicalExternalIdsSchema,
  provenance: canonicalProvenanceSchema.optional(),
  verification: verificationMetadataSchema,
});

export const canonicalVariantSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-variant-[a-z0-9-]+$/,
      'canonicalId must follow mv-variant-<slug> format'
    ),
  baseCharacterId: z
    .string()
    .regex(
      /^mv-character-[a-z0-9-]+$/,
      'baseCharacterId must follow mv-character-<slug> format'
    ),
  name: z.string().min(1, 'Variant name is required'),
  variantDesignation: z.string().optional(),
  universeId: z.string().min(1, 'universeId is required'),
  overview: z.string().optional(),
  avatar: mediaAssetSchema.nullable().optional(),
  externalIds: canonicalExternalIdsSchema.optional(),
  provenance: canonicalProvenanceSchema.optional(),
  verification: verificationMetadataSchema,
});

// ----------------------------------------------------
// Appearance & Relationship Schemas (Document 3 Section 6)
// ----------------------------------------------------

export const canonicalMediaTypeSchema = z.enum([
  'movie',
  'tv',
  'series',
  'season',
  'episode',
]);

export const canonicalAppearanceSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-app-[a-z0-9-]+$/,
      'canonicalId must follow mv-app-<slug> format'
    ),
  characterId: z.string().regex(/^mv-character-[a-z0-9-]+$/),
  mediaType: canonicalMediaTypeSchema,
  mediaCanonicalId: z.string().min(1),
  roleName: z.string().min(1),
  isUncredited: z.boolean().optional(),
  characterVariantId: z.string().optional(),
  verification: verificationMetadataSchema,
});

// ----------------------------------------------------
// Curated Watch Guide Schemas (Document 3 Section 10)
// ----------------------------------------------------

export const roadToDoomsdayTierSchema = z.enum([
  'tier-1-absolute-essentials',
  'tier-2-multiverse-foundation',
  'tier-3-character-depth-context',
  'tier-4-supplemental-lore',
]);

export const watchGuideEntrySchema = z.object({
  id: z.string().min(1),
  entityType: z.enum(['movie', 'series']),
  entityCanonicalId: z.string().min(1),
  title: z.string().min(1),
  tier: roadToDoomsdayTierSchema,
  curatedOrder: z.number().int().positive(),
  whyWatchThis: z.string().min(1),
  keyPlotPoints: z.array(z.string()).optional(),
  verification: verificationMetadataSchema,
});

export const watchGuideSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  entries: z.array(watchGuideEntrySchema),
  version: z.string().min(1),
});
