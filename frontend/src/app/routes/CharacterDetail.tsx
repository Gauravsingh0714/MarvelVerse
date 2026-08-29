import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useCharacter,
  useCharacterAppearances,
} from '../../hooks/useCharacters.js';
import { useMovies } from '../../hooks/useMovies.js';
import {
  Card,
  Badge,
  Button,
  Alert,
  Skeleton,
  Avatar,
} from '../../components/ui/index.js';
import {
  ArrowLeft,
  User,
  Dna,
  Tag,
  Film,
  ExternalLink,
  RefreshCw,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function CharacterDetail() {
  const { canonicalId } = useParams<{ canonicalId: string }>();
  const navigate = useNavigate();

  const {
    data: character,
    isLoading: isCharacterLoading,
    error: characterError,
    refetch: refetchCharacter,
  } = useCharacter(canonicalId ?? null);

  const {
    data: appearances,
    isLoading: isAppearancesLoading,
    error: appearancesError,
  } = useCharacterAppearances(canonicalId ?? null);

  const { data: movies } = useMovies();

  if (isCharacterLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Card>
          <Card.Body className="space-y-6 p-8">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
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

  if (characterError || !character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/characters')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Characters
        </Button>
        <Alert
          variant="error"
          title="Character Not Found"
          icon={<User className="w-5 h-5" />}
        >
          <div className="space-y-3">
            <p>
              {characterError?.message ||
                `No verified canonical character record found for ID "${canonicalId}".`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchCharacter}
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
        <Link to="/characters">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Characters
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {character.species && (
            <Badge variant="vibranium" size="md">
              <Dna className="w-3.5 h-3.5 mr-1" />
              {character.species}
            </Badge>
          )}
          {character.verification?.status && (
            <Badge variant="primary" size="md">
              <Shield className="w-3.5 h-3.5 mr-1" />
              {character.verification.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Character Hero Card */}
      <Card className="border-stroke-subtle shadow-xl">
        <Card.Body className="p-6 sm:p-8 space-y-6">
          {/* Header Info with Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-stroke-subtle pb-6">
            <Avatar
              name={character.name}
              size="xl"
              className="w-20 h-20 text-2xl border-2 border-starkRed/30"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
                  {character.name}
                </h1>
                {character.realName &&
                  character.realName !== character.name && (
                    <span className="text-base text-content-muted font-normal">
                      ({character.realName})
                    </span>
                  )}
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-content-muted">
                <span>Canonical ID: {character.canonicalId}</span>
              </div>
            </div>
          </div>

          {/* Aliases */}
          {character.aliases && character.aliases.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Known Aliases
              </h2>
              <div className="flex flex-wrap gap-2">
                {character.aliases.map((alias) => (
                  <Badge key={alias} variant="primary" size="md">
                    <Tag className="w-3 h-3 mr-1" />
                    {alias}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Overview */}
          {character.overview && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Biography & Lore Overview
              </h2>
              <p className="text-base text-content-secondary leading-relaxed">
                {character.overview}
              </p>
            </div>
          )}

          {/* External Identifiers */}
          {character.externalIds && (
            <div className="pt-4 border-t border-stroke-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-content-muted">
                  External Identifiers:
                </span>
                {character.externalIds.tmdb && (
                  <Badge variant="info" size="sm">
                    TMDB Person #{character.externalIds.tmdb}
                  </Badge>
                )}
              </div>

              {character.externalIds.tmdb && (
                <a
                  href={`https://www.themoviedb.org/person/${character.externalIds.tmdb}`}
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

      {/* Media Appearances Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stroke-subtle pb-3">
          <h2 className="text-xl font-bold text-content-primary flex items-center gap-2">
            <Film className="w-5 h-5 text-starkRed" />
            Verified Film Appearances
          </h2>
          {appearances && (
            <Badge variant="default" size="sm">
              {appearances.length} Records
            </Badge>
          )}
        </div>

        {isAppearancesLoading ? (
          <Skeleton.Group className="py-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </Skeleton.Group>
        ) : appearancesError ? (
          <Alert variant="warning" title="Appearances Unavailable">
            {appearancesError.message ||
              'Unable to load appearance records for this character.'}
          </Alert>
        ) : !appearances || appearances.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-8 text-content-secondary text-sm">
              No movie appearance records currently verified for this character.
            </Card.Body>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appearances.map((app) => {
              const matchedMovie = movies?.find(
                (m) => m.canonicalId === app.mediaCanonicalId
              );
              const movieTitle = matchedMovie?.title || app.mediaCanonicalId;

              return (
                <Link
                  key={app.canonicalId}
                  to={`/movies/${app.mediaCanonicalId}`}
                  className="block group"
                >
                  <Card interactive className="h-full border-stroke-subtle">
                    <Card.Body className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-sm text-content-primary group-hover:text-starkRed transition-colors">
                            {movieTitle}
                          </h3>
                          <p className="text-xs text-content-secondary">
                            Role:{' '}
                            <span className="font-medium text-content-primary">
                              {app.roleName}
                            </span>
                          </p>
                        </div>
                        {app.isUncredited && (
                          <Badge variant="warning" size="sm">
                            Uncredited
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-content-muted font-mono pt-2 border-t border-stroke-subtle/50">
                        <span>Movie Details</span>
                        <span className="inline-flex items-center gap-1 text-starkRed font-sans font-medium group-hover:translate-x-0.5 transition-transform">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
