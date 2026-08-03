import { ResponseStatus } from '../enums/response-status.enum.js';
import { ErrorCode } from '../enums/error-code.enum.js';

export interface ResponseMeta {
  timestamp: string;
  version: string;
  requestId?: string;
}

export interface SuccessResponse<T> {
  status: ResponseStatus.SUCCESS;
  data: T;
  meta?: ResponseMeta;
}

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  status: ResponseStatus.ERROR | ResponseStatus.FAIL;
  message: string;
  code: ErrorCode;
  errors?: ErrorDetail[];
  meta?: ResponseMeta;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}
