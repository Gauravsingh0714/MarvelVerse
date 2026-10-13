import { CanonicalCharacter, CanonicalVariant } from '@marvelverse/shared';
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

  private getVariantsInternal(): CanonicalVariant[] {
    return this.cache.getOrLoad('character_variants', () => {
      const variants = this.loader.loadVariants();
      return variants.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  // --- Character Methods ---

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

  // --- Variant Methods ---

  public getVariants(): CanonicalVariant[] {
    const variants = this.getVariantsInternal();
    return this.clone(variants);
  }

  public getVariantById(canonicalId: string): CanonicalVariant | null {
    const variants = this.getVariantsInternal();
    const found = variants.find((v) => v.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  public getVariantsByCharacter(baseCharacterId: string): CanonicalVariant[] {
    const variants = this.getVariantsInternal();
    const filtered = variants.filter(
      (v) => v.baseCharacterId === baseCharacterId
    );
    return this.clone(filtered);
  }

  public getVariantsByUniverse(universeId: string): CanonicalVariant[] {
    const variants = this.getVariantsInternal();
    const filtered = variants.filter((v) => v.universeId === universeId);
    return this.clone(filtered);
  }
}
