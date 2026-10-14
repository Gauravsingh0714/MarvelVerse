import { Request, Response, NextFunction } from 'express';
import { getCanonicalRepository } from '../services/repository/index.js';
import { ApiNotFoundError } from '../errors/ApiError.js';
import { MediaAssetType, MediaSize } from '@marvelverse/shared';

export class MediaController {
  public resolveMedia = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const { provider, path, type, kind, size, altText, fallback } =
        req.query as unknown as {
          provider: string;
          path?: string;
          type?: MediaAssetType;
          kind?: MediaAssetType;
          size?: MediaSize;
          altText?: string;
          fallback?: boolean;
        };

      const resolved = repository.media.resolveRaw(
        provider,
        path,
        type || kind || 'poster',
        {
          size,
          altText,
          fallback,
        }
      );

      res.json({ data: resolved });
    } catch (err) {
      next(err);
    }
  };

  public getMovieMedia = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const { canonicalId } = req.params;
      const { size, posterSize, backdropSize, fallback } = req.query as {
        size?: MediaSize;
        posterSize?: MediaSize;
        backdropSize?: MediaSize;
        fallback?: boolean;
      };

      const bundle = repository.media.getMovieMedia(canonicalId, {
        size,
        posterSize,
        backdropSize,
        fallback,
      });

      if (!bundle) {
        return next(new ApiNotFoundError(`Movie not found: ${canonicalId}`));
      }

      res.json({ data: bundle });
    } catch (err) {
      next(err);
    }
  };

  public getSeriesMedia = (req: Request, res: Response, next: NextFunction) => {
    try {
      const repository = getCanonicalRepository();
      const { canonicalId } = req.params;
      const { size, posterSize, backdropSize, fallback } = req.query as {
        size?: MediaSize;
        posterSize?: MediaSize;
        backdropSize?: MediaSize;
        fallback?: boolean;
      };

      const bundle = repository.media.getSeriesMedia(canonicalId, {
        size,
        posterSize,
        backdropSize,
        fallback,
      });

      if (!bundle) {
        return next(new ApiNotFoundError(`Series not found: ${canonicalId}`));
      }

      res.json({ data: bundle });
    } catch (err) {
      next(err);
    }
  };

  public getCharacterMedia = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const repository = getCanonicalRepository();
      const { canonicalId } = req.params;
      const { size, avatarSize, fallback } = req.query as {
        size?: MediaSize;
        avatarSize?: MediaSize;
        fallback?: boolean;
      };

      const bundle = repository.media.getCharacterMedia(canonicalId, {
        size,
        avatarSize,
        fallback,
      });

      if (!bundle) {
        return next(
          new ApiNotFoundError(`Character not found: ${canonicalId}`)
        );
      }

      res.json({ data: bundle });
    } catch (err) {
      next(err);
    }
  };
}
