import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';

export class AppearanceController {
  public getAppearances = (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const appearances = repository.relationships.getAppearances();
      res.json({
        data: appearances,
        meta: { count: appearances.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getAppearanceById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const appearance = repository.relationships.getAppearanceById(
        req.params.canonicalId
      );
      if (!appearance) {
        return next(new ApiNotFoundError('Appearance relationship not found'));
      }
      res.json({ data: appearance });
    } catch (err) {
      next(err);
    }
  };

  public getAppearancesByCharacter = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const characterId = req.params.characterId;

      const character = repository.characters.getCharacterById(characterId);
      if (!character) {
        return next(new ApiNotFoundError('Character not found'));
      }

      const appearances =
        repository.relationships.getAppearancesByCharacter(characterId);
      res.json({
        data: appearances,
        meta: { count: appearances.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getAppearancesByMovie = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const movieId = req.params.movieId;

      const movie = repository.movies.getMovieById(movieId);
      if (!movie) {
        return next(new ApiNotFoundError('Movie not found'));
      }

      const appearances =
        repository.relationships.getAppearancesByMedia(movieId);
      res.json({
        data: appearances,
        meta: { count: appearances.length },
      });
    } catch (err) {
      next(err);
    }
  };
}
