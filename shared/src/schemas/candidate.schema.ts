import { z } from 'zod';

/**
 * Candidate Zod Validation Schemas
 * MarvelVerse - Stage 2.5
 */

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const candidateSourceSchema = z.object({
  source: z.literal('tmdb'),
  sourceId: z.number().int().positive('sourceId must be a positive integer'),
  acquiredAt: z
    .string()
    .datetime({ message: 'acquiredAt must be an ISO datetime string' }),
});

export const movieCandidateSchema = candidateSourceSchema.extend({
  candidateId: z.string().min(1, 'candidateId is required'),
  title: z.string().min(1, 'Movie title is required'),
  originalTitle: z.string(),
  overview: z.string(),
  releaseDate: z
    .string()
    .regex(isoDateRegex, 'releaseDate must be YYYY-MM-DD')
    .nullable(),
  runtime: z.number().int().nonnegative().nullable(),
  genres: z.array(z.string()),
  popularity: z.number().nonnegative(),
  voteAverage: z.number().min(0).max(10),
  voteCount: z.number().int().nonnegative(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  originalLanguage: z.string().min(1),
  adult: z.boolean(),
  externalIds: z.record(z.unknown()),
});

export const tvCandidateSchema = candidateSourceSchema.extend({
  candidateId: z.string().min(1, 'candidateId is required'),
  name: z.string().min(1, 'TV series name is required'),
  originalName: z.string(),
  overview: z.string(),
  firstAirDate: z
    .string()
    .regex(isoDateRegex, 'firstAirDate must be YYYY-MM-DD')
    .nullable(),
  lastAirDate: z
    .string()
    .regex(isoDateRegex, 'lastAirDate must be YYYY-MM-DD')
    .nullable(),
  genres: z.array(z.string()),
  numberOfSeasons: z.number().int().nonnegative(),
  numberOfEpisodes: z.number().int().nonnegative(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  originalLanguage: z.string().min(1),
  popularity: z.number().nonnegative(),
  voteAverage: z.number().min(0).max(10),
  voteCount: z.number().int().nonnegative(),
});

export const castMemberCandidateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  originalName: z.string(),
  character: z.string(),
  order: z.number().int().nonnegative(),
  profilePath: z.string().nullable(),
});

export const crewMemberCandidateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  originalName: z.string(),
  department: z.string(),
  job: z.string(),
  profilePath: z.string().nullable(),
});

export const creditsCandidateSchema = candidateSourceSchema.extend({
  candidateId: z.string().min(1),
  mediaType: z.enum(['movie', 'tv']),
  cast: z.array(castMemberCandidateSchema),
  crew: z.array(crewMemberCandidateSchema),
});

export const episodeCandidateSchema = z.object({
  id: z.number().int().positive(),
  episodeNumber: z.number().int().nonnegative(),
  name: z.string(),
  overview: z.string(),
  airDate: z.string().regex(isoDateRegex).nullable(),
  runtime: z.number().int().nonnegative().nullable(),
  stillPath: z.string().nullable(),
  voteAverage: z.number().min(0).max(10),
});

export const seasonCandidateSchema = candidateSourceSchema.extend({
  candidateId: z.string().min(1),
  tvSourceId: z.number().int().positive(),
  seasonNumber: z.number().int().nonnegative(),
  seasonName: z.string(),
  overview: z.string(),
  airDate: z.string().regex(isoDateRegex).nullable(),
  episodeCount: z.number().int().nonnegative(),
  episodes: z.array(episodeCandidateSchema),
});
