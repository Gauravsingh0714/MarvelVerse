import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';
import { RoadToDoomsdayTier } from '@marvelverse/shared';

export class CuratedController {
  public getRoadToDoomsday = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const { tier } = req.query as {
        tier?: RoadToDoomsdayTier;
      };

      const guide =
        repository.watchGuides.getWatchGuideBySlug('road-to-doomsday') ||
        repository.watchGuides.getWatchGuideById(
          'mv-watchguide-road-to-doomsday'
        );

      if (!guide) {
        return next(new ApiNotFoundError('Curated watch guide not found'));
      }

      let entries = repository.watchGuides.getEntries(guide.slug);

      if (tier) {
        entries = entries.filter((e) => e.tier === tier);
      }

      res.json({
        data: entries,
        meta: {
          count: entries.length,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
