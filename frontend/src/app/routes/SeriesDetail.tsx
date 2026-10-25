import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useSeriesDetail } from '../../hooks/useSeries.js';
import { usePhases, useSagas } from '../../hooks/useFoundation.js';
import {
  Card,
  Badge,
  Button,
  Alert,
  Skeleton,
  MediaImage,
} from '../../components/ui/index.js';
import {
  Tv,
  ArrowLeft,
  Calendar,
  Layers,
  Clock,
  ExternalLink,
  Shield,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { formatDate } from '../../utils/date.utils.js';

const heroStaggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const heroItemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export default function SeriesDetail() {
  const { canonicalId } = useParams<{ canonicalId: string }>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const {
    data: series,
    isLoading: isSeriesLoading,
    error: seriesError,
    refetch: refetchSeries,
  } = useSeriesDetail(canonicalId || null);

  const { data: phases } = usePhases();
  const { data: sagas } = useSagas();

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  // Active season derivation
  const seasons = series?.seasons || [];
  const activeSeason = useMemo(() => {
    if (seasons.length === 0) return null;
    return (
      seasons.find((s) => s.seasonNumber === selectedSeasonNumber) || seasons[0]
    );
  }, [seasons, selectedSeasonNumber]);

  const phaseName = useMemo(() => {
    if (!series || !phases) return null;
    const phase = phases.find((p) => p.id === series.phaseId);
    return phase
      ? `${phase.name} (${phase.id.toUpperCase()})`
      : series.phaseId?.toUpperCase();
  }, [series, phases]);

  const sagaName = useMemo(() => {
    if (!series || !sagas) return null;
    const saga = sagas.find((s) => s.id === series.sagaId);
    return saga?.name || series.sagaId;
  }, [series, sagas]);

  if (isSeriesLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Skeleton className="h-9 w-36 rounded-md" />
        <Card className="overflow-hidden">
          <Skeleton className="w-full h-72 sm:h-96" />
          <Card.Body className="p-6 sm:p-8 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton.Group className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Skeleton.Group>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (seriesError || !series) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/series')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to TV Series
        </Button>
        <Alert
          variant="error"
          title="TV Series Not Found"
          icon={<Tv className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <p>
              {seriesError?.message ||
                `No verified canonical TV series record found for ID "${canonicalId}".`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchSeries}
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
        <Link to="/series">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to TV Series
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {phaseName && (
            <Badge variant="vibranium" size="md">
              {phaseName}
            </Badge>
          )}
          {sagaName && (
            <Badge variant="primary" size="md">
              {sagaName}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Series Hero Card */}
      <Card className="border-stroke-subtle shadow-xl overflow-hidden">
        {/* Cinematic Backdrop Banner */}
        <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-surface-raised overflow-hidden">
          <MediaImage
            canonicalId={series.canonicalId}
            entityType="series"
            mediaKind="backdrop"
            alt={`Backdrop for ${series.title}`}
            aspectRatio="backdrop"
            className="w-full h-full object-cover object-center"
            size="large"
            fallbackText={series.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>

        <Card.Body className="p-6 sm:p-8 space-y-6 relative -mt-16 sm:-mt-24">
          <motion.div
            variants={heroStaggerContainer}
            initial={prefersReducedMotion ? false : 'initial'}
            animate="animate"
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-stroke-subtle pb-6">
              <div className="w-28 sm:w-36 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border-2 border-surface-raised shadow-lg bg-surface-raised">
                <MediaImage
                  canonicalId={series.canonicalId}
                  entityType="series"
                  mediaKind="poster"
                  alt={`Poster for ${series.title}`}
                  aspectRatio="poster"
                  className="w-full h-full object-cover"
                  size="medium"
                  fallbackText={series.title}
                />
              </div>

              <div className="space-y-2 flex-1">
                <motion.div
                  variants={prefersReducedMotion ? {} : heroItemVariants}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="vibranium" size="sm">
                      <Tv className="w-3 h-3 mr-1" />
                      TV Series
                    </Badge>
                    {series.universeId && (
                      <Badge variant="default" size="sm">
                        <Globe className="w-3 h-3 mr-1" />
                        {series.universeId}
                      </Badge>
                    )}
                    {series.verification?.status && (
                      <Badge variant="primary" size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        {series.verification.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
                    {series.title}
                  </h1>
                </motion.div>

                {/* Primary Metadata */}
                <motion.div
                  variants={prefersReducedMotion ? {} : heroItemVariants}
                  className="flex flex-wrap items-center gap-4 text-xs text-content-muted"
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-starkRed" />
                    Premiere: {formatDate(series.firstAirDate)}
                  </span>
                  {series.lastAirDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-vibraniumCyan" />
                      Concluded: {formatDate(series.lastAirDate)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-vibraniumCyan" />
                    {series.numberOfSeasons}{' '}
                    {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'} •{' '}
                    {series.numberOfEpisodes} Total Episodes
                  </span>
                </motion.div>

                {/* Genres */}
                {series.genres && series.genres.length > 0 && (
                  <motion.div
                    variants={prefersReducedMotion ? {} : heroItemVariants}
                    className="flex flex-wrap gap-1.5 pt-1"
                  >
                    {series.genres.map((genre) => (
                      <Badge key={genre} variant="default" size="sm">
                        {genre}
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Overview & Synopsis */}
            {series.overview && (
              <motion.div
                variants={prefersReducedMotion ? {} : heroItemVariants}
                className="space-y-2"
              >
                <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
                  Series Overview & Synopsis
                </h2>
                <p className="text-base text-content-secondary leading-relaxed">
                  {series.overview}
                </p>
              </motion.div>
            )}

            {/* External Identifiers */}
            {series.externalIds && (
              <motion.div
                variants={prefersReducedMotion ? {} : heroItemVariants}
                className="pt-4 border-t border-stroke-subtle flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-content-muted">
                    External Identifiers:
                  </span>
                  {series.externalIds.tmdb && (
                    <Badge variant="info" size="sm">
                      TMDB Series #{series.externalIds.tmdb}
                    </Badge>
                  )}
                  {series.externalIds.imdb && (
                    <Badge variant="default" size="sm">
                      IMDb: {series.externalIds.imdb}
                    </Badge>
                  )}
                </div>

                {series.externalIds.tmdb && (
                  <a
                    href={`https://www.themoviedb.org/tv/${series.externalIds.tmdb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-starkRed hover:underline font-medium"
                  >
                    View on TMDB <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>
        </Card.Body>
      </Card>

      {/* Seasons and Episodes Browser */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stroke-subtle pb-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
              <Layers className="w-6 h-6 text-starkRed" />
              Seasons & Canonical Episodes
            </h2>
            <p className="text-xs text-content-secondary mt-0.5">
              Verified episode listings, release dates, runtimes, and storyline
              synopses.
            </p>
          </div>

          {/* Season Selector Tabs */}
          {seasons.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {seasons.map((season) => (
                <Button
                  key={season.canonicalId}
                  variant={
                    selectedSeasonNumber === season.seasonNumber
                      ? 'primary'
                      : 'secondary'
                  }
                  size="sm"
                  onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                >
                  Season {season.seasonNumber} ({season.episodeCount} Ep)
                </Button>
              ))}
            </div>
          )}
        </div>

        {seasons.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-10 text-content-secondary text-sm">
              No verified season records currently associated with this TV
              series.
            </Card.Body>
          </Card>
        ) : !activeSeason ? (
          <Alert variant="info" title="No Season Selected">
            Please select a season above to explore episodes.
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Active Season Header Card */}
            <div className="p-4 rounded-xl bg-surface-raised border border-stroke-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-content-primary">
                  {activeSeason.title || `Season ${activeSeason.seasonNumber}`}
                </h3>
                <div className="flex items-center gap-3 text-xs text-content-muted mt-1">
                  <span>{activeSeason.episodeCount} Episodes</span>
                  {activeSeason.airDate && (
                    <span>Aired: {formatDate(activeSeason.airDate)}</span>
                  )}
                </div>
              </div>
              <Badge variant="vibranium" size="sm">
                Canonical Season #{activeSeason.seasonNumber}
              </Badge>
            </div>

            {/* Episode Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSeason.episodes.map((ep) => (
                <Card
                  key={ep.id || ep.canonicalId || ep.episodeNumber}
                  className="border-stroke-subtle flex flex-col justify-between"
                >
                  <Card.Header
                    bordered
                    className="py-2.5 px-4 flex items-center justify-between"
                  >
                    <Badge variant="primary" size="sm">
                      Episode {ep.episodeNumber}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-content-muted">
                      {ep.airDate && (
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-starkRed" />
                          {formatDate(ep.airDate)}
                        </span>
                      )}
                    </div>
                  </Card.Header>

                  <Card.Body className="p-4 space-y-2 flex-1">
                    <h4 className="font-bold text-base text-content-primary">
                      {ep.title}
                    </h4>

                    {ep.runtime && (
                      <div className="text-xs text-vibraniumCyan font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ep.runtime} min
                      </div>
                    )}

                    <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed">
                      {ep.overview || 'No synopsis provided for this episode.'}
                    </p>
                  </Card.Body>

                  {ep.canonicalId && (
                    <Card.Footer
                      bordered
                      className="py-2 px-4 text-[11px] font-mono text-content-muted"
                    >
                      {ep.canonicalId}
                    </Card.Footer>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
