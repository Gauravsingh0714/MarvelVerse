import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';
import { FoundationRepository } from './foundation-repository.js';
import { MovieRepository } from './movie-repository.js';
import { CharacterRepository } from './character-repository.js';
import { RelationshipRepository } from './relationship-repository.js';

export interface CanonicalRepositoryOptions {
  baseWorkspaceDir?: string;
  loader?: CanonicalDataLoader;
  cache?: CanonicalCache;
}

export class CanonicalRepository {
  public readonly foundation: FoundationRepository;
  public readonly movies: MovieRepository;
  public readonly characters: CharacterRepository;
  public readonly relationships: RelationshipRepository;
  public readonly cache: CanonicalCache;

  constructor(options: CanonicalRepositoryOptions = {}) {
    this.cache = options.cache ?? new CanonicalCache();
    const loader =
      options.loader ?? new CanonicalDataLoader(options.baseWorkspaceDir);

    this.foundation = new FoundationRepository(loader, this.cache);
    this.movies = new MovieRepository(loader, this.cache);
    this.characters = new CharacterRepository(loader, this.cache);
    this.relationships = new RelationshipRepository(loader, this.cache);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export function createCanonicalRepository(
  options: CanonicalRepositoryOptions = {}
): CanonicalRepository {
  return new CanonicalRepository(options);
}
