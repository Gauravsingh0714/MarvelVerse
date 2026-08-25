import { Router } from 'express';
import { CharacterController } from '../../controllers/character.controller.js';
import { AppearanceController } from '../../controllers/appearance.controller.js';
import { validateParams } from '../../middleware/validate-request.js';
import {
  positiveIntegerParamSchema,
  characterCanonicalIdParamSchema,
} from '../../schemas/api.schema.js';
import { z } from 'zod';

const router = Router();
const characterController = new CharacterController();
const appearanceController = new AppearanceController();

// 1. GET /characters (Collection)
router.get('/', characterController.getCharacters);

// 2. GET /characters/tmdb/:tmdbId (TMDB Lookup - registered BEFORE /:canonicalId)
router.get(
  '/tmdb/:tmdbId',
  validateParams(z.object({ tmdbId: positiveIntegerParamSchema })),
  characterController.getCharacterByTmdbId
);

// 3. GET /characters/:characterId/appearances (Nested Appearances - registered BEFORE /:canonicalId)
router.get(
  '/:characterId/appearances',
  validateParams(z.object({ characterId: characterCanonicalIdParamSchema })),
  appearanceController.getAppearancesByCharacter
);

// 4. GET /characters/:canonicalId (Canonical ID Lookup)
router.get(
  '/:canonicalId',
  validateParams(z.object({ canonicalId: characterCanonicalIdParamSchema })),
  characterController.getCharacterById
);

export default router;
