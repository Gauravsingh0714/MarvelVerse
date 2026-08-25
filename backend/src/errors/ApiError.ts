export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR';

  constructor(
    statusCode: number,
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR',
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ApiValidationError extends ApiError {
  constructor(message = 'Invalid request parameters') {
    super(400, 'VALIDATION_ERROR', message);
    this.name = 'ApiValidationError';
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
    this.name = 'ApiNotFoundError';
  }
}

export class ApiInternalError extends ApiError {
  constructor(message = 'An unexpected error occurred') {
    super(500, 'INTERNAL_ERROR', message);
    this.name = 'ApiInternalError';
  }
}
