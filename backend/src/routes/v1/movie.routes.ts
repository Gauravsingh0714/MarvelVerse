import { Router } from 'express';
import { MovieController } from '../../controllers/movie.controller.js';
import { AppearanceController } from '../../controllers/appearance.controller.js';
import {
  validateParams,
  validateQuery,
} from '../../middleware/validate-request.js';
import {
  movieQuerySchema,
  positiveIntegerParamSchema,
  movieCanonicalIdParamSchema,
} from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const movieController = new MovieController();
const appearanceController = new AppearanceController();

// 1. GET /movies (Collection + Filtering)
router.get('/', validateQuery(movieQuerySchema), movieController.getMovies);

// 2. GET /movies/tmdb/:tmdbId (TMDB Lookup - registered BEFORE /:canonicalId)
router.get(
  '/tmdb/:tmdbId',
  validateParams(z.object({ tmdbId: positiveIntegerParamSchema })),
  movieController.getMovieByTmdbId
);

// 3. GET /movies/:movieId/appearances (Nested Appearances - registered BEFORE /:canonicalId)
router.get(
  '/:movieId/appearances',
  validateParams(z.object({ movieId: movieCanonicalIdParamSchema })),
  appearanceController.getAppearancesByMovie
);

// 4. GET /movies/:canonicalId (Canonical ID Lookup)
router.get(
  '/:canonicalId',
  validateParams(z.object({ canonicalId: movieCanonicalIdParamSchema })),
  movieController.getMovieById
);

export default router;
