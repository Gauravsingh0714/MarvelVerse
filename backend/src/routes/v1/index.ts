import { Router } from 'express';
import foundationRoutes from './foundation.routes.js';
import movieRoutes from './movie.routes.js';
import seriesRoutes from './series.routes.js';
import characterRoutes from './character.routes.js';
import appearanceRoutes from './appearance.routes.js';
import mediaRoutes from './media.routes.js';
import curatedRoutes from './curated.routes.js';
import healthRoutes from '../../health/health.routes.js';

const router = Router();

// Health endpoint
router.use('/health', healthRoutes);

// Stage 2.8 & Stage 4.4B Versioned API Routes
router.use('/', foundationRoutes);
router.use('/movies', movieRoutes);
router.use('/series', seriesRoutes);
router.use('/characters', characterRoutes);
router.use('/appearances', appearanceRoutes);
router.use('/media', mediaRoutes);
router.use('/curated', curatedRoutes);

export default router;
