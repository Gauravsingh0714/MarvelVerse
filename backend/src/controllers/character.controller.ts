import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';

export class CharacterController {
  public getCharacters = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const characters = repository.characters.getCharacters();
      res.json({
        data: characters,
        meta: { count: characters.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getCharacterById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const character = repository.characters.getCharacterById(
        req.params.canonicalId
      );
      if (!character) {
        return next(new ApiNotFoundError('Character not found'));
      }
      res.json({ data: character });
    } catch (err) {
      next(err);
    }
  };

  public getCharacterByTmdbId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const tmdbId = Number(req.params.tmdbId);
      const character = repository.characters.getCharacterByTmdbId(tmdbId);
      if (!character) {
        return next(new ApiNotFoundError('Character not found'));
      }
      res.json({ data: character });
    } catch (err) {
      next(err);
    }
  };
}
