/**
 * AppError — operational error base class.
 *
 * `ApiError` and its subclasses (ApiValidationError, ApiNotFoundError,
 * ApiInternalError) are the canonical error types used throughout the
 * application; see ./ApiError.ts. AppError is retained here for the
 * error-handler middleware which performs an `instanceof AppError` check as
 * a fallback path.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
