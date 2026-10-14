import { Router } from 'express';
import { MediaController } from '../../controllers/media.controller.js';
import {
  validateParams,
  validateQuery,
} from '../../middleware/validate-request.js';
import {
  mediaResolveQuerySchema,
  mediaEntityOptionsQuerySchema,
  movieCanonicalIdParamSchema,
  seriesCanonicalIdParamSchema,
  characterCanonicalIdParamSchema,
} from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const mediaController = new MediaController();

// 1. GET /media/resolve (Static resolution route registered FIRST)
router.get(
  '/resolve',
  validateQuery(mediaResolveQuerySchema),
  mediaController.resolveMedia
);

// 2. GET /media/movies/:canonicalId
router.get(
  '/movies/:canonicalId',
  validateParams(z.object({ canonicalId: movieCanonicalIdParamSchema })),
  validateQuery(mediaEntityOptionsQuerySchema),
  mediaController.getMovieMedia
);

// 3. GET /media/series/:canonicalId
router.get(
  '/series/:canonicalId',
  validateParams(z.object({ canonicalId: seriesCanonicalIdParamSchema })),
  validateQuery(mediaEntityOptionsQuerySchema),
  mediaController.getSeriesMedia
);

// 4. GET /media/characters/:canonicalId
router.get(
  '/characters/:canonicalId',
  validateParams(z.object({ canonicalId: characterCanonicalIdParamSchema })),
  validateQuery(mediaEntityOptionsQuerySchema),
  mediaController.getCharacterMedia
);

export default router;
