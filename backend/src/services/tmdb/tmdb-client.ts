import {
  TmdbMovieResponse,
  TmdbTvResponse,
  TmdbCreditsResponse,
  TmdbSeasonResponse,
  TmdbSearchMovieResponse,
  TmdbSearchTvResponse,
} from '@marvelverse/shared';

export interface TmdbClientConfig {
  readAccessToken?: string;
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class TmdbClientError extends Error {
  public readonly status?: number;
  public readonly resource?: string;

  constructor(message: string, status?: number, resource?: string) {
    super(message);
    this.name = 'TmdbClientError';
    this.status = status;
    this.resource = resource;
  }
}

export function sanitizeSecrets(
  text: string,
  secrets: Array<string | undefined>
): string {
  let sanitized = text;
  for (const secret of secrets) {
    if (secret && secret.length > 3) {
      sanitized = sanitized.replaceAll(secret, '[REDACTED_SECRET]');
    }
  }
  return sanitized;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TmdbClient {
  private readonly readAccessToken?: string;
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(config: TmdbClientConfig = {}) {
    this.readAccessToken =
      config.readAccessToken ?? process.env.TMDB_API_READ_ACCESS_TOKEN;
    this.apiKey = config.apiKey ?? process.env.TMDB_API_KEY;
    this.baseUrl = (config.baseUrl ?? 'https://api.themoviedb.org/3').replace(
      /\/+$/,
      ''
    );
    this.timeoutMs = config.timeoutMs ?? 10000;
    this.maxRetries = config.maxRetries ?? 3;

    if (!this.readAccessToken && !this.apiKey) {
      throw new TmdbClientError(
        'TMDB authentication credentials missing. Configure TMDB_API_READ_ACCESS_TOKEN or TMDB_API_KEY.'
      );
    }
  }

  public async get<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });

    if (!this.readAccessToken && this.apiKey) {
      url.searchParams.append('api_key', this.apiKey);
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'MarvelVerse-Pipeline/1.0',
    };

    if (this.readAccessToken) {
      headers.Authorization = `Bearer ${this.readAccessToken}`;
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers,
          signal: controller.signal,
        });

        if (response.status === 429 && attempt <= this.maxRetries) {
          const retryAfterHeader = response.headers.get('Retry-After');
          const waitMs = retryAfterHeader
            ? Number.parseInt(retryAfterHeader, 10) * 1000
            : 1000 * attempt;
          await delay(waitMs);
          continue;
        }

        if (!response.ok) {
          let errDetails = '';
          try {
            const errJson = (await response.json()) as {
              status_message?: string;
            };
            errDetails = errJson.status_message
              ? `: ${errJson.status_message}`
              : '';
          } catch {
            // ignore json parse error on error response
          }

          const safeMsg = sanitizeSecrets(
            `TMDB Request failed [${response.status} ${response.statusText}] for ${cleanEndpoint}${errDetails}`,
            [this.readAccessToken, this.apiKey]
          );

          throw new TmdbClientError(safeMsg, response.status, cleanEndpoint);
        }

        const data = (await response.json()) as T;
        return data;
      } catch (err: unknown) {
        if (err instanceof TmdbClientError) {
          throw err;
        }

        if (attempt <= this.maxRetries) {
          await delay(500 * attempt);
          continue;
        }

        const rawMessage =
          err instanceof Error
            ? err.name === 'AbortError'
              ? `TMDB Request timed out after ${this.timeoutMs}ms for ${cleanEndpoint}`
              : err.message
            : String(err);

        const safeMsg = sanitizeSecrets(
          `TMDB Network Error on ${cleanEndpoint}: ${rawMessage}`,
          [this.readAccessToken, this.apiKey]
        );

        throw new TmdbClientError(safeMsg, undefined, cleanEndpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw new TmdbClientError(
      `TMDB Request failed after ${this.maxRetries} attempts for ${cleanEndpoint}`
    );
  }

  public async getMovie(movieId: number): Promise<TmdbMovieResponse> {
    return this.get<TmdbMovieResponse>(`/movie/${movieId}`);
  }

  public async getTvSeries(tvId: number): Promise<TmdbTvResponse> {
    return this.get<TmdbTvResponse>(`/tv/${tvId}`);
  }

  public async getMovieCredits(movieId: number): Promise<TmdbCreditsResponse> {
    return this.get<TmdbCreditsResponse>(`/movie/${movieId}/credits`);
  }

  public async getTvCredits(tvId: number): Promise<TmdbCreditsResponse> {
    return this.get<TmdbCreditsResponse>(`/tv/${tvId}/credits`);
  }

  public async getTvSeason(
    tvId: number,
    seasonNumber: number
  ): Promise<TmdbSeasonResponse> {
    return this.get<TmdbSeasonResponse>(`/tv/${tvId}/season/${seasonNumber}`);
  }

  public async searchMovies(
    query: string,
    page = 1
  ): Promise<TmdbSearchMovieResponse> {
    return this.get<TmdbSearchMovieResponse>('/search/movie', {
      query,
      page,
      include_adult: false,
    });
  }

  public async searchTvSeries(
    query: string,
    page = 1
  ): Promise<TmdbSearchTvResponse> {
    return this.get<TmdbSearchTvResponse>('/search/tv', {
      query,
      page,
      include_adult: false,
    });
  }
}
