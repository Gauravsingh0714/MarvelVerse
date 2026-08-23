import { CanonicalMovie } from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class MovieRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  private getAllInternal(): CanonicalMovie[] {
    return this.cache.getOrLoad('movies', () => {
      const movies = this.loader.loadMovies();
      return movies.sort((a, b) => a.releaseOrder - b.releaseOrder);
    });
  }

  public getMovies(): CanonicalMovie[] {
    const movies = this.getAllInternal();
    return this.clone(movies);
  }

  public getMovieById(canonicalId: string): CanonicalMovie | null {
    const movies = this.getAllInternal();
    const found = movies.find((m) => m.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  public getMovieByTmdbId(tmdbId: number): CanonicalMovie | null {
    const movies = this.getAllInternal();
    const found = movies.find((m) => m.externalIds?.tmdb === tmdbId);
    return found ? this.clone(found) : null;
  }

  public getMoviesByUniverse(universeId: string): CanonicalMovie[] {
    const movies = this.getAllInternal();
    const filtered = movies.filter((m) => m.universeId === universeId);
    return this.clone(filtered);
  }

  public getMoviesBySaga(sagaId: string): CanonicalMovie[] {
    const movies = this.getAllInternal();
    const filtered = movies.filter((m) => m.sagaId === sagaId);
    return this.clone(filtered);
  }

  public getMoviesByPhase(phaseId: string): CanonicalMovie[] {
    const movies = this.getAllInternal();
    const filtered = movies.filter((m) => m.phaseId === phaseId);
    return this.clone(filtered);
  }

  public getMoviesByReleaseOrder(): CanonicalMovie[] {
    const movies = this.getAllInternal();
    const sorted = [...movies].sort((a, b) => a.releaseOrder - b.releaseOrder);
    return this.clone(sorted);
  }
}
