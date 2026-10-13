import {
  CanonicalTvSeries,
  CanonicalSeason,
  CanonicalEpisode,
} from '@marvelverse/shared';
import { CanonicalDataLoader } from './canonical-data-loader.js';
import { CanonicalCache } from './canonical-cache.js';

export class TvRepository {
  private readonly loader: CanonicalDataLoader;
  private readonly cache: CanonicalCache;

  constructor(loader?: CanonicalDataLoader, cache?: CanonicalCache) {
    this.loader = loader ?? new CanonicalDataLoader();
    this.cache = cache ?? new CanonicalCache();
  }

  private clone<T>(data: T): T {
    return structuredClone(data);
  }

  private getSeriesInternal(): CanonicalTvSeries[] {
    return this.cache.getOrLoad('tv_series', () => {
      const series = this.loader.loadTvSeries();
      return series.sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  private getSeasonsInternal(): CanonicalSeason[] {
    return this.cache.getOrLoad('tv_seasons', () => {
      const seasons = this.loader.loadSeasons();
      return seasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
    });
  }

  private getEpisodesInternal(): CanonicalEpisode[] {
    return this.cache.getOrLoad('tv_episodes', () => {
      return this.loader.loadEpisodes();
    });
  }

  // --- Series Methods ---

  public getSeries(): CanonicalTvSeries[] {
    const series = this.getSeriesInternal();
    return this.clone(series);
  }

  public getSeriesById(canonicalId: string): CanonicalTvSeries | null {
    const series = this.getSeriesInternal();
    const found = series.find((s) => s.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  public getSeriesByTmdbId(tmdbId: number): CanonicalTvSeries | null {
    const series = this.getSeriesInternal();
    const found = series.find((s) => s.externalIds?.tmdb === tmdbId);
    return found ? this.clone(found) : null;
  }

  public getSeriesByUniverse(universeId: string): CanonicalTvSeries[] {
    const series = this.getSeriesInternal();
    const filtered = series.filter((s) => s.universeId === universeId);
    return this.clone(filtered);
  }

  public getSeriesBySaga(sagaId: string): CanonicalTvSeries[] {
    const series = this.getSeriesInternal();
    const filtered = series.filter((s) => s.sagaId === sagaId);
    return this.clone(filtered);
  }

  public getSeriesByPhase(phaseId: string): CanonicalTvSeries[] {
    const series = this.getSeriesInternal();
    const filtered = series.filter((s) => s.phaseId === phaseId);
    return this.clone(filtered);
  }

  // --- Season Methods ---

  public getSeasons(tvCanonicalId?: string): CanonicalSeason[] {
    const seasons = this.getSeasonsInternal();
    if (tvCanonicalId) {
      const filtered = seasons.filter((s) => s.tvCanonicalId === tvCanonicalId);
      return this.clone(filtered);
    }
    return this.clone(seasons);
  }

  public getSeasonById(canonicalId: string): CanonicalSeason | null {
    const seasons = this.getSeasonsInternal();
    const found = seasons.find((s) => s.canonicalId === canonicalId);
    return found ? this.clone(found) : null;
  }

  // --- Episode Methods ---

  public getEpisodes(seasonCanonicalId?: string): CanonicalEpisode[] {
    if (seasonCanonicalId) {
      const season = this.getSeasonById(seasonCanonicalId);
      return season?.episodes ? this.clone(season.episodes) : [];
    }
    const all = this.getEpisodesInternal();
    return this.clone(all);
  }

  public getEpisodeById(
    episodeId: number | string,
    seasonCanonicalId?: string
  ): CanonicalEpisode | null {
    const pool = this.getEpisodes(seasonCanonicalId);
    const found = pool.find((ep) =>
      typeof episodeId === 'number'
        ? ep.id === episodeId
        : ep.canonicalId === episodeId || ep.id === Number(episodeId)
    );
    return found ? this.clone(found) : null;
  }
}
