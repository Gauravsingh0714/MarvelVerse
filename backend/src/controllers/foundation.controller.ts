import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';

export class FoundationController {
  public getUniverses = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const universes = repository.foundation.getUniverses();
      res.json({
        data: universes,
        meta: { count: universes.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getUniverseById = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const universe = repository.foundation.getUniverseById(
        req.params.universeId
      );
      if (!universe) {
        return next(new ApiNotFoundError('Universe not found'));
      }
      res.json({ data: universe });
    } catch (err) {
      next(err);
    }
  };

  public getSagas = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const sagas = repository.foundation.getSagas();
      res.json({
        data: sagas,
        meta: { count: sagas.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getSagaById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const saga = repository.foundation.getSagaById(req.params.sagaId);
      if (!saga) {
        return next(new ApiNotFoundError('Saga not found'));
      }
      res.json({ data: saga });
    } catch (err) {
      next(err);
    }
  };

  public getPhases = (_req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const phases = repository.foundation.getPhases();
      res.json({
        data: phases,
        meta: { count: phases.length },
      });
    } catch (err) {
      next(err);
    }
  };

  public getPhaseById = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const phase = repository.foundation.getPhaseById(req.params.phaseId);
      if (!phase) {
        return next(new ApiNotFoundError('Phase not found'));
      }
      res.json({ data: phase });
    } catch (err) {
      next(err);
    }
  };
}
