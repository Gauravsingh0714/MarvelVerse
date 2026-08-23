import { CanonicalCharacter } from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class CharacterRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  private getAllInternal(): CanonicalCharacter[] {
    return this.cache.getOrLoad('characters', () => {
      const characters = this.loader.loadCharacters();
      return characters.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  public getCharacters(): CanonicalCharacter[] {
    const characters = this.getAllInternal();
    return this.clone(characters);
  }

  public getCharacterById(canonicalId: string): CanonicalCharacter | null {
    const characters = this.getAllInternal();
    const found = characters.find((c) => c.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  public getCharacterByTmdbId(tmdbId: number): CanonicalCharacter | null {
    const characters = this.getAllInternal();
    const found = characters.find((c) => c.externalIds?.tmdb === tmdbId);
    return found ? this.clone(found) : null;
  }
}
