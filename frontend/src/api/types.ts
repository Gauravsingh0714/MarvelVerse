/**
 * Frontend API Contract & Transport Types
 * Stage 2.9 / 4.2 — Alignment with Backend /api/v1 Response Envelopes
 *
 * Response envelope types are defined canonically in @marvelverse/shared
 * and re-exported here for frontend consumers.
 */

export type {
  ApiSuccessResponse,
  ApiCollectionMeta,
  ApiCollectionResponse,
  ApiErrorPayload,
  ApiErrorResponse,
} from '@marvelverse/shared';

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
