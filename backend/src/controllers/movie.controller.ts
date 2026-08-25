import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';

export class MovieController {
  public getMovies = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const { universeId, sagaId, phaseId, sort } = req.query as {
        universeId?: string;
        sagaId?: string;
        phaseId?: string;
        sort?: string;
      };

      let movies = repository.movies.getMovies();

      if (universeId) {
        movies = movies.filter((m) => m.universeId === universeId);
      }
      if (sagaId) {
        movies = movies.filter((m) => m.sagaId === sagaId);
      }
      if (phaseId) {
        movies = movies.filter((m) => m.phaseId === phaseId);
      }

      if (sort === 'releaseOrder') {
        movies.sort((a, b) => a.releaseOrder - b.releaseOrder);
      }

      res.json({
        data: movies,
        meta: { count: movies.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getMovieById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const movie = repository.movies.getMovieById(req.params.canonicalId);
      if (!movie) {
        return next(new ApiNotFoundError('Movie not found'));
      }
      res.json({ data: movie });
    } catch (err) {
      next(err);
    }
  };

  public getMovieByTmdbId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const tmdbId = Number(req.params.tmdbId);
      const movie = repository.movies.getMovieByTmdbId(tmdbId);
      if (!movie) {
        return next(new ApiNotFoundError('Movie not found'));
      }
      res.json({ data: movie });
    } catch (err) {
      next(err);
    }
  };
}
