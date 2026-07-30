import { Router } from 'express';
import healthRoutes from '../health/health.routes.js';

const router = Router();

router.use('/health', healthRoutes);

// Placeholders for future routes
const placeholderHandler = (name: string) => (_req: any, res: any) =>
  res.json({ message: `${name} endpoint placeholder` });

router.use('/movies', placeholderHandler('movies'));
router.use('/characters', placeholderHandler('characters'));
router.use('/timeline', placeholderHandler('timeline'));
router.use('/search', placeholderHandler('search'));
router.use('/actors', placeholderHandler('actors'));
router.use('/teams', placeholderHandler('teams'));
router.use('/locations', placeholderHandler('locations'));
router.use('/events', placeholderHandler('events'));

export default router;
