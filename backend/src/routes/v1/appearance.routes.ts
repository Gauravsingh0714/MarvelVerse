import { Router } from 'express';
import { AppearanceController } from '../../controllers/appearance.controller.js';
import { validateParams } from '../../middleware/validate-request.js';
import { appearanceCanonicalIdParamSchema } from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const controller = new AppearanceController();

// 1. GET /appearances
router.get('/', controller.getAppearances);

// 2. GET /appearances/:canonicalId
router.get(
  '/:canonicalId',
  validateParams(z.object({ canonicalId: appearanceCanonicalIdParamSchema })),
  controller.getAppearanceById
);

export default router;
