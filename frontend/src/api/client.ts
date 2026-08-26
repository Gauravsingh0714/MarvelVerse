import { ApiClientError, ApiErrorResponse } from './types.js';

function getApiBaseUrl(): string {
  let envUrl: string | undefined;

  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv) {
      envUrl =
        (metaEnv.VITE_API_BASE_URL as string) ||
        (metaEnv.VITE_API_URL as string);
    }
  } catch {
    // Ignore in non-Vite contexts
  }

  if (!envUrl && typeof process !== 'undefined' && process.env) {
    envUrl = process.env.VITE_API_BASE_URL || process.env.VITE_API_URL;
  }

  return (envUrl || 'http://localhost:3000/api/v1').replace(/\/+$/, '');
}

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = (baseUrl || getApiBaseUrl()).replace(/\/+$/, '');
  }

  public async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const formattedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`;
    const url = `${this.baseUrl}${formattedEndpoint}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...options.headers,
        },
        ...options,
      });
    } catch (err) {
      throw new ApiClientError(
        'NETWORK_ERROR',
        'Unable to connect to the backend server. Please check your connection.',
        0
      );
    }

    if (!response.ok) {
      let errorBody: ApiErrorResponse | null = null;
      try {
        errorBody = (await response.json()) as ApiErrorResponse;
      } catch {
        // Fallback for non-JSON error responses
      }

      const code = errorBody?.error?.code || `HTTP_${response.status}`;
      const message =
        errorBody?.error?.message ||
        `Request failed with status ${response.status} (${response.statusText})`;

      throw new ApiClientError(code, message, response.status);
    }

    try {
      return (await response.json()) as T;
    } catch (err) {
      throw new ApiClientError(
        'PARSE_ERROR',
        'Failed to parse JSON response from API server.',
        response.status
      );
    }
  }
}

export const apiClient = new ApiClient();
