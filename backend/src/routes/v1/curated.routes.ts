import { Router } from 'express';
import { CuratedController } from '../../controllers/curated.controller.js';
import { validateQuery } from '../../middleware/validate-request.js';
import { doomsdayQuerySchema } from '../../schemas/api.schema.js';

const router = Router();
const curatedController = new CuratedController();

// 1. GET /curated/doomsday (Road to Doomsday Curated Watch Guide)
router.get(
  '/doomsday',
  validateQuery(doomsdayQuerySchema),
  curatedController.getRoadToDoomsday
);

export default router;
