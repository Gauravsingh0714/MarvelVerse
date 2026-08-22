import { z } from 'zod';

/**
 * MarvelVerse Canonical Entity Zod Schemas
 * Stage 2.6
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
  sourceId: z.number().int().positive(),
  acquiredAt: z.string().datetime().optional(),
});

export const canonicalUniverseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
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
  releaseOrder: z
    .number()
    .int()
    .positive('releaseOrder must be a positive integer'),
  runtime: z.number().int().positive().nullable().optional(),
  overview: z.string(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
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
  lastAirDate: z
    .string()
    .regex(isoDateRegex, 'lastAirDate must be YYYY-MM-DD')
    .nullable()
    .optional(),
  numberOfSeasons: z.number().int().nonnegative(),
  numberOfEpisodes: z.number().int().nonnegative(),
  overview: z.string(),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  genres: z.array(z.string()),
  universeId: z.string().min(1, 'universeId is required'),
  sagaId: z.string().min(1, 'sagaId is required'),
  phaseId: z.string().min(1, 'phaseId is required'),
  externalIds: canonicalExternalIdsSchema,
  provenance: canonicalProvenanceSchema,
  verification: verificationMetadataSchema,
});

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
  externalIds: canonicalExternalIdsSchema,
  provenance: canonicalProvenanceSchema.optional(),
  verification: verificationMetadataSchema,
});

export const canonicalAppearanceSchema = z.object({
  canonicalId: z
    .string()
    .regex(
      /^mv-app-[a-z0-9-]+$/,
      'canonicalId must follow mv-app-<slug> format'
    ),
  characterId: z.string().regex(/^mv-character-[a-z0-9-]+$/),
  mediaType: z.enum(['movie', 'tv']),
  mediaCanonicalId: z.string().min(1),
  roleName: z.string().min(1),
  isUncredited: z.boolean().optional(),
  verification: verificationMetadataSchema,
});
