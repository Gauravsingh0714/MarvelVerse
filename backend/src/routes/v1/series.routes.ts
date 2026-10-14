import { Router } from 'express';
import { SeriesController } from '../../controllers/series.controller.js';
import {
  validateParams,
  validateQuery,
} from '../../middleware/validate-request.js';
import {
  seriesQuerySchema,
  seriesCanonicalIdParamSchema,
} from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const seriesController = new SeriesController();

// 1. GET /series (Collection + Filtering)
router.get('/', validateQuery(seriesQuerySchema), seriesController.getSeries);

// 2. GET /series/:canonicalId (Canonical ID Lookup)
router.get(
  '/:canonicalId',
  validateParams(z.object({ canonicalId: seriesCanonicalIdParamSchema })),
  seriesController.getSeriesById
);

export default router;
