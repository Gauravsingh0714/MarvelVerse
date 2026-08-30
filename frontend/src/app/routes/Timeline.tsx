import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CanonicalSaga,
  CanonicalPhase,
  CanonicalMovie,
} from '@marvelverse/shared';
import { useMovies } from '../../hooks/useMovies.js';
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
} from 'lucide-react';

interface PhaseGroup {
  phase: CanonicalPhase;
  movies: CanonicalMovie[];
}

interface SagaGroup {
  saga: CanonicalSaga;
  phases: PhaseGroup[];
  totalMovies: number;
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

  const isLoading =
    isUniversesLoading || isSagasLoading || isPhasesLoading || isMoviesLoading;
  const combinedError =
    universesError || sagasError || phasesError || moviesError;

  const handleRefetchAll = () => {
    refetchUniverses();
    refetchSagas();
    refetchPhases();
    refetchMovies();
  };

  // Primary universe context (Earth-616 is primary MCU continuity)
  const primaryUniverse = useMemo(() => {
    return universes?.find((u) => u.id === 'earth-616') || universes?.[0];
  }, [universes]);

  // Hierarchical grouping: Saga -> Phase -> Movies (Strategy A)
  const sagaGroups = useMemo<SagaGroup[]>(() => {
    if (!sagas || !phases || !movies) return [];

    const sortedSagas = [...sagas].sort((a, b) => a.order - b.order);
    const sortedPhases = [...phases].sort((a, b) => a.number - b.number);

    return sortedSagas.map((saga) => {
      const sagaPhases = sortedPhases.filter((p) => p.sagaId === saga.id);

      let totalMoviesInSaga = 0;

      const phaseGroups: PhaseGroup[] = sagaPhases.map((phase) => {
        const phaseMovies = movies.filter((m) => m.phaseId === phase.id);
        totalMoviesInSaga += phaseMovies.length;
        return {
          phase,
          movies: phaseMovies,
        };
      });

      return {
        saga,
        phases: phaseGroups,
        totalMovies: totalMoviesInSaga,
      };
    });
  }, [sagas, phases, movies]);

  // Filtered sagas based on active tab selection
  const displayedSagaGroups = useMemo(() => {
    if (selectedSagaId === 'all') return sagaGroups;
    return sagaGroups.filter((sg) => sg.saga.id === selectedSagaId);
  }, [sagaGroups, selectedSagaId]);

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
          <h1 className="text-3xl font-extrabold tracking-tight text-content-primary flex items-center gap-3">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <Button
          variant={selectedSagaId === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedSagaId('all')}
          leftIcon={<Layers className="w-4 h-4" />}
        >
          All Sagas ({movies?.length || 0} Releases)
        </Button>

        {sagas?.map((saga) => {
          const matchedGroup = sagaGroups.find((sg) => sg.saga.id === saga.id);
          const count = matchedGroup?.totalMovies || 0;

          return (
            <Button
              key={saga.id}
              variant={selectedSagaId === saga.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedSagaId(saga.id)}
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
                  {sagaGroup.totalMovies} Total Releases
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
                          {phaseGroup.movies.length}{' '}
                          {phaseGroup.movies.length === 1 ? 'Movie' : 'Movies'}
                        </span>
                      </div>

                      {/* Phase Movies Grid or Empty Phase Fallback */}
                      {phaseGroup.movies.length === 0 ? (
                        <div className="p-4 rounded-lg bg-surface-raised border border-stroke-subtle/60 flex items-center gap-3 text-xs text-content-secondary">
                          <Info className="w-4 h-4 text-content-muted shrink-0" />
                          <span>
                            No verified movies are currently associated with{' '}
                            <strong>{phaseGroup.phase.name}</strong>.
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {phaseGroup.movies.map((movie) => (
                            <Link
                              key={movie.canonicalId}
                              to={`/movies/${movie.canonicalId}`}
                              className="block group"
                            >
                              <Card
                                interactive
                                className="h-full border-stroke-subtle"
                              >
                                <Card.Header
                                  bordered
                                  className="py-2.5 px-4 flex items-center justify-between"
                                >
                                  <Badge variant="primary" size="sm">
                                    Release #{movie.releaseOrder}
                                  </Badge>
                                  <span className="text-xs font-mono text-content-muted">
                                    {movie.releaseDate.slice(0, 4)}
                                  </span>
                                </Card.Header>

                                <Card.Body className="p-4 space-y-2">
                                  <h4 className="font-bold text-base text-content-primary group-hover:text-starkRed transition-colors">
                                    {movie.title}
                                  </h4>

                                  <div className="flex items-center gap-3 text-xs text-content-muted">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-starkRed" />
                                      {movie.releaseDate}
                                    </span>
                                    {movie.runtime && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-vibraniumCyan" />
                                        {movie.runtime} min
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                                    {movie.overview}
                                  </p>
                                </Card.Body>

                                <Card.Footer
                                  bordered
                                  className="py-2.5 px-4 flex items-center justify-between text-xs"
                                >
                                  <span className="font-mono text-[11px] text-content-muted truncate max-w-[150px]">
                                    {movie.canonicalId}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-starkRed font-medium group-hover:translate-x-0.5 transition-transform">
                                    Details <ArrowRight className="w-3 h-3" />
                                  </span>
                                </Card.Footer>
                              </Card>
                            </Link>
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
