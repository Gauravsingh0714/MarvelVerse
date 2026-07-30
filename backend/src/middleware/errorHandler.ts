import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../logger/index.js';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  logger.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};
