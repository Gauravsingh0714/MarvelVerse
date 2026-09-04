import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies.js';
import { usePhases } from '../../hooks/useFoundation.js';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Alert,
  Skeleton,
} from '../../components/ui/index.js';
import {
  Film,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  FilterX,
} from 'lucide-react';

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [phaseFilter, setPhaseFilter] = useState<string>('');

  const {
    data: movies,
    isLoading: isMoviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useMovies({
    phaseId: phaseFilter || undefined,
    sort: 'releaseOrder',
  });

  const { data: phases } = usePhases();

  // Local filtering for title and genre matching
  const filteredMovies = useMemo(() => {
    if (!movies) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return movies;

    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.genres.some((g) => g.toLowerCase().includes(query))
    );
  }, [movies, searchQuery]);

  if (isMoviesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton.Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </Skeleton.Group>
      </div>
    );
  }

  if (moviesError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert
          variant="error"
          title="Unable to Load Marvel Canonical Movies"
          icon={<Film className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <p>
              {moviesError.message ||
                'Please check if the MarvelVerse API server is running.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchMovies}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stroke-subtle pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-content-primary flex items-center gap-3">
            <Film className="w-8 h-8 text-starkRed" />
            Marvel Canonical Movies
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            Verified Marvel Cinematic Universe releases powered by TMDB &
            Canonical Data Architecture.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search movie title or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
            >
              <option value="">All Phases</option>
              {phases?.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name} ({phase.id.toUpperCase()})
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Movies Grid / Empty States */}
      {!filteredMovies || filteredMovies.length === 0 ? (
        <div className="py-12">
          {!searchQuery && !phaseFilter ? (
            <Alert variant="info" title="No Canonical Movies Found">
              <p>No verified canonical movies are currently available.</p>
            </Alert>
          ) : (
            <Alert variant="info" title="No Canonical Movies Found">
              <div className="space-y-3">
                <p>
                  No verified movie records match your current search or phase
                  filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setPhaseFilter('');
                  }}
                  leftIcon={<FilterX className="w-4 h-4" />}
                >
                  Clear Search & Filters
                </Button>
              </div>
            </Alert>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <Link key={movie.canonicalId} to={`/movies/${movie.canonicalId}`}>
              <Card interactive className="h-full group border-stroke-subtle">
                <Card.Header bordered className="py-3 px-5">
                  <Badge variant="primary" size="sm">
                    Release #{movie.releaseOrder}
                  </Badge>
                  <Badge variant="vibranium" size="sm">
                    {phases?.find((p) => p.id === movie.phaseId)?.name ||
                      movie.phaseId.toUpperCase()}
                  </Badge>
                </Card.Header>

                <Card.Body className="space-y-3 p-5">
                  <h2 className="text-xl font-bold text-content-primary tracking-tight group-hover:text-starkRed transition-colors">
                    {movie.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-content-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-starkRed" />
                      {movie.releaseDate}
                    </span>
                    {movie.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-vibraniumCyan" />
                        {movie.runtime} min
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed">
                    {movie.overview}
                  </p>
                </Card.Body>

                <Card.Footer bordered className="py-3 px-5">
                  <div className="flex flex-wrap gap-1.5 flex-1 mr-2">
                    {movie.genres.slice(0, 3).map((g) => (
                      <Badge key={g} variant="default" size="sm">
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {g}
                      </Badge>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-starkRed group-hover:translate-x-0.5 transition-transform">
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Card.Footer>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
