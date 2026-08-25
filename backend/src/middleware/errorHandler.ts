import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiNotFoundError } from '../errors/ApiError.js';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/index.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof AppError) {
    const code =
      err.statusCode === 404
        ? 'NOT_FOUND'
        : err.statusCode === 400
          ? 'VALIDATION_ERROR'
          : 'INTERNAL_ERROR';

    res.status(err.statusCode).json({
      error: {
        code,
        message: err.message,
      },
    });
    return;
  }

  logger.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new ApiNotFoundError('Route not found'));
};
