import { ResponseStatus } from '../enums/response-status.enum.js';
import { ErrorCode } from '../enums/error-code.enum.js';

export interface ResponseMeta {
  timestamp: string;
  version: string;
  requestId?: string;
}

/**
 * Canonical Runtime Response Envelopes
 * Stage 2.8 / 2.9 / 4.2 runtime conventions:
 * - Single item: { data: T }
 * - Collection:  { data: T[], meta: { count: number } }
 * - Error:       { error: { code: string, message: string } }
 */

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiCollectionMeta {
  count: number;
}

export interface ApiCollectionResponse<T> {
  data: T[];
  meta: ApiCollectionMeta;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
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
