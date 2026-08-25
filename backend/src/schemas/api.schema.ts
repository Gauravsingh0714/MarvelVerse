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
