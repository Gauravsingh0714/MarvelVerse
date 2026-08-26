/**
 * Frontend API Contract & Transport Types
 * Stage 2.9 — Alignment with Backend /api/v1 Response Envelopes
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

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly originalMessage: string;

  constructor(code: string, message: string, status = 0) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.originalMessage = message;
  }
}
