import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiValidationError } from '../errors/ApiError.js';

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const msg = result.error.issues.map((i) => i.message).join('; ');
      return next(new ApiValidationError(msg || 'Invalid path parameters'));
    }
    req.params = result.data as any;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new ApiValidationError('Invalid request parameters'));
    }
    req.query = result.data as any;
    next();
  };
}
