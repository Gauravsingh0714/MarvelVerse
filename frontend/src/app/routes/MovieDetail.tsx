import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMovie, useMovieAppearances } from '../../hooks/useMovies.js';
import {
  usePhases,
  useSagas,
  useUniverses,
} from '../../hooks/useFoundation.js';
import {
  Card,
  Badge,
  Button,
  Alert,
  Skeleton,
} from '../../components/ui/index.js';
import {
  ArrowLeft,
  Film,
  Calendar,
  Clock,
  Tag,
  Globe,
  Layers,
  Sparkles,
  ExternalLink,
  User,
  RefreshCw,
} from 'lucide-react';

export default function MovieDetail() {
  const { canonicalId } = useParams<{ canonicalId: string }>();
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading: isMovieLoading,
    error: movieError,
    refetch: refetchMovie,
  } = useMovie(canonicalId ?? null);

  const {
    data: appearances,
    isLoading: isAppearancesLoading,
    error: appearancesError,
  } = useMovieAppearances(canonicalId ?? null);

  const { data: phases } = usePhases();
  const { data: sagas } = useSagas();
  const { data: universes } = useUniverses();

  // Resolve display names
  const phaseName =
    phases?.find((p) => p.id === movie?.phaseId)?.name ||
    movie?.phaseId.toUpperCase();
  const sagaName =
    sagas?.find((s) => s.id === movie?.sagaId)?.name || movie?.sagaId;
  const universeName =
    universes?.find((u) => u.id === movie?.universeId)?.name ||
    movie?.universeId;

  if (isMovieLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Card>
          <Card.Body className="space-y-6 p-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton.Group className="py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Skeleton.Group>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/movies')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Movies
        </Button>
        <Alert
          variant="error"
          title="Movie Not Found"
          icon={<Film className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <p>
              {movieError?.message ||
                `No verified canonical movie record found for ID "${canonicalId}".`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchMovie}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Loading
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/movies">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Movies
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            Release #{movie.releaseOrder}
          </Badge>
          <Badge variant="vibranium" size="md">
            {phaseName}
          </Badge>
        </div>
      </div>

      {/* Main Movie Hero Card */}
      <Card className="border-stroke-subtle shadow-xl">
        <Card.Body className="p-6 sm:p-8 space-y-6">
          {/* Header Info */}
          <div className="space-y-3 border-b border-stroke-subtle pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
                {movie.title}
              </h1>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <span className="text-sm text-content-muted font-normal italic">
                  ({movie.originalTitle})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-content-secondary">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-starkRed" />
                {movie.releaseDate}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-vibraniumCyan" />
                  {movie.runtime} minutes
                </span>
              )}
              <span className="flex items-center gap-1.5 font-mono text-xs text-content-muted">
                Canonical ID: {movie.canonicalId}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
              Synopsis & Lore Overview
            </h2>
            <p className="text-base text-content-secondary leading-relaxed">
              {movie.overview}
            </p>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
              Genres
            </h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="default" size="md">
                  <Tag className="w-3 h-3 text-content-secondary mr-1" />
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Marvel Classification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stroke-subtle">
            <div className="p-4 rounded-lg bg-surface-raised border border-stroke-subtle space-y-1">
              <span className="text-xs font-semibold text-content-muted flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-vibraniumCyan" />
                Universe
              </span>
              <p className="text-sm font-bold text-content-primary">
                {universeName}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-raised border border-stroke-subtle space-y-1">
              <span className="text-xs font-semibold text-content-muted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-statusWarning" />
                Saga
              </span>
              <p className="text-sm font-bold text-content-primary">
                {sagaName}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-surface-raised border border-stroke-subtle space-y-1">
              <span className="text-xs font-semibold text-content-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-starkRed" />
                Phase
              </span>
              <p className="text-sm font-bold text-content-primary">
                {phaseName}
              </p>
            </div>
          </div>

          {/* External Identifiers */}
          {movie.externalIds && (
            <div className="pt-4 border-t border-stroke-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-content-muted">
                  External Identifiers:
                </span>
                {movie.externalIds.tmdb && (
                  <Badge variant="info" size="sm">
                    TMDB #{movie.externalIds.tmdb}
                  </Badge>
                )}
                {movie.externalIds.imdb && (
                  <Badge variant="default" size="sm">
                    IMDb #{movie.externalIds.imdb}
                  </Badge>
                )}
              </div>

              {movie.externalIds.tmdb && (
                <a
                  href={`https://www.themoviedb.org/movie/${movie.externalIds.tmdb}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-starkRed hover:underline font-medium"
                >
                  View on TMDB <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Character Appearances Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stroke-subtle pb-3">
          <h2 className="text-xl font-bold text-content-primary flex items-center gap-2">
            <User className="w-5 h-5 text-starkRed" />
            Character Appearances
          </h2>
          {appearances && (
            <Badge variant="default" size="sm">
              {appearances.length} Records
            </Badge>
          )}
        </div>

        {isAppearancesLoading ? (
          <Skeleton.Group className="py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Skeleton.Group>
        ) : appearancesError ? (
          <Alert variant="warning" title="Appearances Unavailable">
            {appearancesError.message ||
              'Unable to load character appearances for this movie.'}
          </Alert>
        ) : !appearances || appearances.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-8 text-content-secondary text-sm">
              No character appearance records currently verified for this movie.
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appearances.map((app) => (
              <Card key={app.canonicalId} className="border-stroke-subtle">
                <Card.Body className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-content-primary">
                      {app.roleName}
                    </span>
                    {app.isUncredited && (
                      <Badge variant="warning" size="sm">
                        Uncredited
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-content-muted font-mono pt-1 border-t border-stroke-subtle/50">
                    <span>Character ID:</span>
                    <span className="text-content-secondary">
                      {app.characterId}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
