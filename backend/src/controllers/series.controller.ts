import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';

export class SeriesController {
  public getSeries = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const { universeId, sagaId, phaseId, sort } = req.query as {
        universeId?: string;
        sagaId?: string;
        phaseId?: string;
        sort?: string;
      };

      let series = repository.tv.getSeries();

      if (universeId) {
        series = series.filter((s) => s.universeId === universeId);
      }
      if (sagaId) {
        series = series.filter((s) => s.sagaId === sagaId);
      }
      if (phaseId) {
        series = series.filter((s) => s.phaseId === phaseId);
      }

      if (sort === 'firstAirDate') {
        series.sort((a, b) => a.firstAirDate.localeCompare(b.firstAirDate));
      } else {
        // Deterministic default sort by title
        series.sort((a, b) => a.title.localeCompare(b.title));
      }

      res.json({
        data: series,
        meta: { count: series.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getSeriesById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const series = repository.tv.getSeriesById(req.params.canonicalId);
      if (!series) {
        return next(new ApiNotFoundError('Series not found'));
      }

      // Preserve Series -> Season -> Episode relationship where available
      const seasons = repository.tv.getSeasons(series.canonicalId);
      const data = seasons.length > 0 ? { ...series, seasons } : series;

      res.json({ data });
    } catch (err) {
      next(err);
    }
  };
}
