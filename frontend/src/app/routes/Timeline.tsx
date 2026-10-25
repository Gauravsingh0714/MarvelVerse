import { useState, useMemo } from 'react';
import { ScrollReveal } from '../../components/ui/Motion/ScrollReveal.js';
import { Link } from 'react-router-dom';
import { CanonicalSaga, CanonicalPhase } from '@marvelverse/shared';
import { useMovies } from '../../hooks/useMovies.js';
import { useSeries } from '../../hooks/useSeries.js';
import {
  useUniverses,
  useSagas,
  usePhases,
} from '../../hooks/useFoundation.js';
import {
  Card,
  Badge,
  Button,
  Alert,
  Skeleton,
} from '../../components/ui/index.js';
import {
  Clock,
  Calendar,
  RefreshCw,
  Layers,
  Globe,
  Sparkles,
  ArrowRight,
  Info,
  Film,
  Tv,
} from 'lucide-react';
import { formatDate, formatYear } from '../../utils/date.utils.js';

export interface TimelineMediaItem {
  id: string;
  canonicalId: string;
  title: string;
  mediaType: 'movie' | 'series';
  releaseDate: string; // ISO date for sorting
  phaseId?: string;
  sagaId?: string;
  universeId: string;
  overview?: string;
  runtime?: number | null;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  releaseOrder?: number;
  detailPath: string;
}

interface PhaseGroup {
  phase: CanonicalPhase;
  items: TimelineMediaItem[];
}

interface SagaGroup {
  saga: CanonicalSaga;
  phases: PhaseGroup[];
  totalItems: number;
}

export default function Timeline() {
  const [selectedSagaId, setSelectedSagaId] = useState<string>('all');

  const {
    data: universes,
    isLoading: isUniversesLoading,
    error: universesError,
    refetch: refetchUniverses,
  } = useUniverses();

  const {
    data: sagas,
    isLoading: isSagasLoading,
    error: sagasError,
    refetch: refetchSagas,
  } = useSagas();

  const {
    data: phases,
    isLoading: isPhasesLoading,
    error: phasesError,
    refetch: refetchPhases,
  } = usePhases();

  const {
    data: movies,
    isLoading: isMoviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useMovies({
    sort: 'releaseOrder',
  });

  const {
    data: seriesList,
    isLoading: isSeriesLoading,
    error: seriesError,
    refetch: refetchSeries,
  } = useSeries();

  const isLoading =
    isUniversesLoading ||
    isSagasLoading ||
    isPhasesLoading ||
    isMoviesLoading ||
    isSeriesLoading;

  const combinedError =
    universesError || sagasError || phasesError || moviesError || seriesError;

  const handleRefetchAll = () => {
    refetchUniverses();
    refetchSagas();
    refetchPhases();
    refetchMovies();
    refetchSeries();
  };

  // Primary universe context (Earth-616 is primary MCU continuity)
  const primaryUniverse = useMemo(() => {
    return universes?.find((u) => u.id === 'earth-616') || universes?.[0];
  }, [universes]);

  // Hierarchical grouping: Saga -> Phase -> Items (Movies & Series unified chronologically)
  const sagaGroups = useMemo<SagaGroup[]>(() => {
    if (!sagas || !phases || (!movies && !seriesList)) return [];

    const sortedSagas = [...sagas].sort((a, b) => a.order - b.order);
    const sortedPhases = [...phases].sort((a, b) => a.number - b.number);

    return sortedSagas.map((saga) => {
      const sagaPhases = sortedPhases.filter((p) => p.sagaId === saga.id);

      let totalItemsInSaga = 0;

      const phaseGroups: PhaseGroup[] = sagaPhases.map((phase) => {
        const phaseMovies: TimelineMediaItem[] = (movies || [])
          .filter((m) => m.phaseId === phase.id)
          .map((m) => ({
            id: `movie-${m.canonicalId}`,
            canonicalId: m.canonicalId,
            title: m.title,
            mediaType: 'movie',
            releaseDate: m.releaseDate,
            phaseId: m.phaseId,
            sagaId: m.sagaId,
            universeId: m.universeId,
            overview: m.overview,
            runtime: m.runtime,
            releaseOrder: m.releaseOrder,
            detailPath: `/movies/${m.canonicalId}`,
          }));

        const phaseSeries: TimelineMediaItem[] = (seriesList || [])
          .filter((s) => s.phaseId === phase.id)
          .map((s) => ({
            id: `series-${s.canonicalId}`,
            canonicalId: s.canonicalId,
            title: s.title,
            mediaType: 'series',
            releaseDate: s.firstAirDate,
            phaseId: s.phaseId,
            sagaId: s.sagaId,
            universeId: s.universeId,
            overview: s.overview,
            numberOfSeasons: s.numberOfSeasons,
            numberOfEpisodes: s.numberOfEpisodes,
            detailPath: `/series/${s.canonicalId}`,
          }));

        // Combine and ensure stable unique identity
        const combined = [...phaseMovies, ...phaseSeries];
        const seen = new Set<string>();
        const uniqueItems: TimelineMediaItem[] = [];
        for (const item of combined) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            uniqueItems.push(item);
          }
        }

        // Chronological sort: ISO date comparison ascending
        uniqueItems.sort((a, b) => {
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return a.releaseDate.localeCompare(b.releaseDate);
        });

        totalItemsInSaga += uniqueItems.length;

        return {
          phase,
          items: uniqueItems,
        };
      });

      return {
        saga,
        phases: phaseGroups,
        totalItems: totalItemsInSaga,
      };
    });
  }, [sagas, phases, movies, seriesList]);

  // Filtered sagas based on active tab selection
  const displayedSagaGroups = useMemo(() => {
    if (selectedSagaId === 'all') return sagaGroups;
    return sagaGroups.filter((sg) => sg.saga.id === selectedSagaId);
  }, [sagaGroups, selectedSagaId]);

  const totalAllReleases = useMemo(() => {
    return sagaGroups.reduce((acc, curr) => acc + curr.totalItems, 0);
  }, [sagaGroups]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Skeleton.Group className="space-y-6 pt-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        </Skeleton.Group>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert
          variant="error"
          title="Unable to Load Marvel Cinematic Universe Timeline"
          icon={<Clock className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <p>
              {combinedError.message ||
                'Please check if the MarvelVerse API server is running.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefetchAll}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stroke-subtle pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-content-primary flex items-center gap-3">
            <Clock className="w-8 h-8 text-starkRed" />
            MCU Chronological Timeline Explorer
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            Structured narrative hierarchy tracking verified releases across
            Sagas and Phases in the Marvel Cinematic Universe.
          </p>
        </div>

        {/* Universe Context Indicator */}
        {primaryUniverse && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-content-muted font-medium">
              Continuity:
            </span>
            <Badge variant="vibranium" size="md">
              <Globe className="w-3.5 h-3.5 mr-1" />
              {primaryUniverse.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Saga Navigation Tabs / Pill Controls */}
      <div
        role="toolbar"
        aria-label="Filter by saga"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin"
      >
        <Button
          variant={selectedSagaId === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedSagaId('all')}
          aria-pressed={selectedSagaId === 'all'}
          leftIcon={<Layers className="w-4 h-4" />}
        >
          All Sagas ({totalAllReleases} Releases)
        </Button>

        {sagas?.map((saga) => {
          const matchedGroup = sagaGroups.find((sg) => sg.saga.id === saga.id);
          const count = matchedGroup?.totalItems || 0;

          return (
            <Button
              key={saga.id}
              variant={selectedSagaId === saga.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedSagaId(saga.id)}
              aria-pressed={selectedSagaId === saga.id}
            >
              {saga.name} ({count})
            </Button>
          );
        })}
      </div>

      {/* Main Hierarchical Timeline Content */}
      {displayedSagaGroups.length === 0 ? (
        <Alert variant="info" title="No Sagas Available">
          No verified sagas are currently configured in the MarvelVerse
          database.
        </Alert>
      ) : (
        <div className="space-y-12">
          {displayedSagaGroups.map((sagaGroup) => (
            <section
              key={sagaGroup.saga.id}
              className="space-y-8 border-l-2 border-starkRed/30 pl-4 sm:pl-6 relative"
            >
              {/* Saga Node Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke-subtle pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-starkRed/10 border border-starkRed/30 flex items-center justify-center text-starkRed">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-content-primary">
                      {sagaGroup.saga.name}
                    </h2>
                    <span className="text-xs text-content-muted font-mono">
                      Canonical Saga Order #{sagaGroup.saga.order}
                    </span>
                  </div>
                </div>

                <Badge variant="primary" size="md">
                  {sagaGroup.totalItems} Total Releases
                </Badge>
              </div>

              {/* Phases within Saga */}
              {sagaGroup.phases.length === 0 ? (
                <p className="text-sm text-content-muted italic py-4">
                  No verified phases available for this saga.
                </p>
              ) : (
                <div className="space-y-8">
                  {sagaGroup.phases.map((phaseGroup) => (
                    <div key={phaseGroup.phase.id} className="space-y-4">
                      {/* Phase Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-vibraniumCyan" />
                          <h3 className="text-lg font-bold text-content-primary">
                            {phaseGroup.phase.name}
                          </h3>
                          <Badge variant="vibranium" size="sm">
                            {phaseGroup.phase.id.toUpperCase()}
                          </Badge>
                        </div>

                        <span className="text-xs text-content-muted font-medium">
                          {phaseGroup.items.length}{' '}
                          {phaseGroup.items.length === 1
                            ? 'Release'
                            : 'Releases'}
                        </span>
                      </div>

                      {/* Phase Items Grid or Empty Phase Fallback */}
                      {phaseGroup.items.length === 0 ? (
                        <div className="p-4 rounded-lg bg-surface-raised border border-stroke-subtle/60 flex items-center gap-3 text-xs text-content-secondary">
                          <Info className="w-4 h-4 text-content-muted shrink-0" />
                          <span>
                            No verified releases are currently associated with{' '}
                            <strong>{phaseGroup.phase.name}</strong>.
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {phaseGroup.items.map((item) => (
                            <ScrollReveal key={item.id}>
                              <Link
                                to={item.detailPath}
                                className="block group"
                              >
                                <Card
                                  interactive
                                  className="h-full border-stroke-subtle flex flex-col justify-between"
                                >
                                  <div>
                                    <Card.Header
                                      bordered
                                      className="py-2.5 px-4 flex items-center justify-between"
                                    >
                                      {item.mediaType === 'movie' ? (
                                        <Badge variant="primary" size="sm">
                                          <Film className="w-3 h-3 mr-1" />
                                          Release #{item.releaseOrder}
                                        </Badge>
                                      ) : (
                                        <Badge variant="vibranium" size="sm">
                                          <Tv className="w-3 h-3 mr-1" />
                                          TV Series
                                        </Badge>
                                      )}
                                      <span className="text-xs font-mono text-content-muted">
                                        {formatYear(item.releaseDate) || 'MCU'}
                                      </span>
                                    </Card.Header>

                                    <Card.Body className="p-4 space-y-2">
                                      <h4 className="font-bold text-base text-content-primary group-hover:text-starkRed transition-colors">
                                        {item.title}
                                      </h4>

                                      <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3 text-starkRed" />
                                          {formatDate(item.releaseDate)}
                                        </span>
                                        {item.mediaType === 'movie' &&
                                          item.runtime && (
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3 text-vibraniumCyan" />
                                              {item.runtime} min
                                            </span>
                                          )}
                                        {item.mediaType === 'series' &&
                                          item.numberOfSeasons && (
                                            <span className="flex items-center gap-1">
                                              <Layers className="w-3 h-3 text-vibraniumCyan" />
                                              {item.numberOfSeasons}{' '}
                                              {item.numberOfSeasons === 1
                                                ? 'Season'
                                                : 'Seasons'}{' '}
                                              • {item.numberOfEpisodes} Ep
                                            </span>
                                          )}
                                      </div>

                                      {item.overview && (
                                        <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                                          {item.overview}
                                        </p>
                                      )}
                                    </Card.Body>
                                  </div>

                                  <Card.Footer
                                    bordered
                                    className="py-2.5 px-4 flex items-center justify-between text-xs"
                                  >
                                    <span className="font-mono text-[11px] text-content-muted truncate max-w-[150px]">
                                      {item.canonicalId}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-starkRed font-medium group-hover:translate-x-0.5 transition-transform">
                                      Details <ArrowRight className="w-3 h-3" />
                                    </span>
                                  </Card.Footer>
                                </Card>
                              </Link>
                            </ScrollReveal>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
