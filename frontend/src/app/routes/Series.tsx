import { useState, useMemo } from 'react';
import { ScrollReveal } from '../../components/ui/Motion/ScrollReveal.js';
import { Link } from 'react-router-dom';
import { useSeries } from '../../hooks/useSeries.js';
import { usePhases } from '../../hooks/useFoundation.js';
import {
  Card,
  Badge,
  Button,
  Input,
  Select,
  Alert,
  Skeleton,
  MediaImage,
} from '../../components/ui/index.js';
import {
  Tv,
  Search,
  RefreshCw,
  Calendar,
  Layers,
  ArrowRight,
  FilterX,
} from 'lucide-react';
import { formatDate } from '../../utils/date.utils.js';

export default function Series() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [phaseFilter, setPhaseFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'title' | 'firstAirDate' | 'releaseOrder'
  >('releaseOrder');

  const {
    data: seriesList,
    isLoading: isSeriesLoading,
    error: seriesError,
    refetch: refetchSeries,
  } = useSeries({
    phaseId: phaseFilter || undefined,
    sort: sortBy,
  });

  const { data: phases } = usePhases();

  // Local filtering for title, overview, and genre matching
  const filteredSeries = useMemo(() => {
    if (!seriesList) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return seriesList;

    return seriesList.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.overview?.toLowerCase().includes(query) ||
        s.genres.some((g) => g.toLowerCase().includes(query))
    );
  }, [seriesList, searchQuery]);

  if (isSeriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton.Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full rounded-xl" />
          ))}
        </Skeleton.Group>
      </div>
    );
  }

  if (seriesError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert
          variant="error"
          title="Unable to Load Marvel Canonical TV Series"
          icon={<Tv className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <p>
              {seriesError.message ||
                'Please check if the MarvelVerse API server is running.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchSeries}
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
          <h1 className="text-3xl font-bold tracking-tight text-content-primary flex items-center gap-3">
            <Tv className="w-8 h-8 text-starkRed" />
            Marvel Television & Series
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            Verified Marvel Cinematic Universe serialized storylines, Disney+
            originals, and canonical series.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Input
              aria-label="Search series"
              placeholder="Search series title, genre, or overview..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              aria-label="Filter by phase"
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

          <div className="w-full sm:w-44">
            <Select
              aria-label="Sort series"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'title' | 'firstAirDate' | 'releaseOrder'
                )
              }
            >
              <option value="releaseOrder">Release Order</option>
              <option value="firstAirDate">Premiere Date</option>
              <option value="title">Title (A-Z)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid of Series */}
      {filteredSeries.length === 0 ? (
        <Card className="py-16 text-center border-dashed">
          <Card.Body className="space-y-4">
            <div className="inline-flex p-3 rounded-full bg-surface-raised border border-stroke-subtle text-content-muted">
              <FilterX className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-content-primary">
                No TV series found
              </h3>
              <p className="text-xs text-content-secondary max-w-sm mx-auto">
                No canonical series matched your active search or phase filter.
                Try clearing filters to view all entries.
              </p>
            </div>
            {(searchQuery || phaseFilter) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setPhaseFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeries.map((series) => (
            <ScrollReveal key={series.canonicalId}>
              <Link
                to={`/series/${series.canonicalId}`}
                className="block group"
              >
                <Card
                  interactive
                  className="h-full flex flex-col border-stroke-subtle"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg bg-surface-raised relative">
                    <MediaImage
                      entityType="series"
                      canonicalId={series.canonicalId}
                      mediaKind="backdrop"
                      alt={`${series.title} series backdrop`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {series.phaseId && (
                        <Badge variant="vibranium" size="sm">
                          {series.phaseId.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Card.Body className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-lg font-bold text-content-primary group-hover:text-starkRed transition-colors line-clamp-1">
                          {series.title}
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-starkRed" />
                          {formatDate(series.firstAirDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-vibraniumCyan" />
                          {series.numberOfSeasons}{' '}
                          {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}{' '}
                          • {series.numberOfEpisodes} Episodes
                        </span>
                      </div>

                      {series.genres && series.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {series.genres.map((genre) => (
                            <Badge key={genre} variant="default" size="sm">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed pt-1">
                        {series.overview}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stroke-subtle/50 flex items-center justify-between text-xs">
                      <span className="font-mono text-content-muted text-[11px] truncate max-w-[140px]">
                        {series.canonicalId}
                      </span>
                      <span className="inline-flex items-center gap-1 text-starkRed font-medium group-hover:translate-x-0.5 transition-transform">
                        Explore Series <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
