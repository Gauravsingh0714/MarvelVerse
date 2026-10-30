import { z } from 'zod';

/**
 * Stage 2.8 API Request Validation Schemas
 */

export const positiveIntegerParamSchema = z
  .string()
  .regex(/^[1-9]\d*$/, 'TMDB ID must be a positive integer')
  .transform((val) => Number.parseInt(val, 10));

export const movieCanonicalIdParamSchema = z
  .string()
  .regex(/^mv-movie-[a-z0-9-]+$/, 'Invalid movie canonical ID format');

export const characterCanonicalIdParamSchema = z
  .string()
  .regex(/^mv-character-[a-z0-9-]+$/, 'Invalid character canonical ID format');

export const appearanceCanonicalIdParamSchema = z
  .string()
  .regex(/^mv-app-[a-z0-9-]+$/, 'Invalid appearance canonical ID format');

export const universeIdParamSchema = z
  .string()
  .min(1, 'universeId is required');

export const sagaIdParamSchema = z.string().min(1, 'sagaId is required');

export const phaseIdParamSchema = z.string().min(1, 'phaseId is required');

export const movieQuerySchema = z
  .object({
    universeId: z.string().optional(),
    sagaId: z.string().optional(),
    phaseId: z.string().optional(),
    sort: z.enum(['releaseOrder']).optional(),
  })
  .strict('Unknown query parameters are not allowed');

export const seriesCanonicalIdParamSchema = z
  .string()
  .regex(/^mv-series-[a-z0-9-]+$/, 'Invalid series canonical ID format');

export const seriesQuerySchema = z
  .object({
    universeId: z.string().optional(),
    sagaId: z.string().optional(),
    phaseId: z.string().optional(),
    sort: z.enum(['title', 'firstAirDate']).optional(),
  })
  .strict('Unknown query parameters are not allowed');

export const roadToDoomsdayTierSchema = z.enum([
  'tier-1-absolute-essentials',
  'tier-2-multiverse-foundation',
  'tier-3-character-depth-context',
  'tier-4-supplemental-lore',
]);

export const doomsdayQuerySchema = z
  .object({
    tier: roadToDoomsdayTierSchema.optional(),
  })
  .strict('Unknown query parameters are not allowed');

export const mediaAssetTypeQuerySchema = z.enum([
  'poster',
  'backdrop',
  'avatar',
  'still',
  'banner',
  'logo',
]);

export const mediaSizeQuerySchema = z.enum([
  'small',
  'medium',
  'large',
  'original',
]);

export const mediaResolveQuerySchema = z
  .object({
    provider: z.string().min(1, 'provider is required'),
    path: z.string().min(1, 'path is required'),
    type: mediaAssetTypeQuerySchema.optional(),
    kind: mediaAssetTypeQuerySchema.optional(),
    size: mediaSizeQuerySchema.optional(),
    altText: z.string().optional(),
    fallback: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => v !== 'false'),
  })
  .strict('Unknown query parameters are not allowed');

export const mediaEntityOptionsQuerySchema = z
  .object({
    size: mediaSizeQuerySchema.optional(),
    posterSize: mediaSizeQuerySchema.optional(),
    backdropSize: mediaSizeQuerySchema.optional(),
    avatarSize: mediaSizeQuerySchema.optional(),
    fallback: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => v !== 'false'),
  })
  .strict('Unknown query parameters are not allowed');
