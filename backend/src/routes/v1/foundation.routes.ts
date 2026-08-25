import { Router } from 'express';
import { FoundationController } from '../../controllers/foundation.controller.js';
import { validateParams } from '../../middleware/validate-request.js';
import {
  universeIdParamSchema,
  sagaIdParamSchema,
  phaseIdParamSchema,
} from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const controller = new FoundationController();

// Universes
router.get('/universes', controller.getUniverses);
router.get(
  '/universes/:universeId',
  validateParams(z.object({ universeId: universeIdParamSchema })),
  controller.getUniverseById
);

// Sagas
router.get('/sagas', controller.getSagas);
router.get(
  '/sagas/:sagaId',
  validateParams(z.object({ sagaId: sagaIdParamSchema })),
  controller.getSagaById
);

// Phases
router.get('/phases', controller.getPhases);
router.get(
  '/phases/:phaseId',
  validateParams(z.object({ phaseId: phaseIdParamSchema })),
  controller.getPhaseById
);

export default router;
