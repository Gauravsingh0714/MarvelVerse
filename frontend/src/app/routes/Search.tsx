import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies.js';
import { useCharacters } from '../../hooks/useCharacters.js';
import {
  Card,
  Badge,
  Button,
  Input,
  Alert,
  Skeleton,
  Avatar,
} from '../../components/ui/index.js';
import {
  Search as SearchIcon,
  Film,
  Users,
  X,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Calendar,
  Clock,
  Tag,
  Dna,
} from 'lucide-react';

type SearchCategory = 'all' | 'movies' | 'characters';

const SUGGESTED_SEARCHES = [
  'Iron Man',
  'Tony Stark',
  'Avengers',
  'Thor',
  'Captain America',
  'Hulk',
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

  const {
    data: movies,
    isLoading: isMoviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useMovies();

  const {
    data: characters,
    isLoading: isCharactersLoading,
    error: charactersError,
    refetch: refetchCharacters,
  } = useCharacters();

  const isLoading = isMoviesLoading || isCharactersLoading;
  const combinedError = moviesError || charactersError;

  const handleRefetchAll = () => {
    refetchMovies();
    refetchCharacters();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter movies
  const matchingMovies = useMemo(() => {
    if (!movies || !normalizedQuery) return [];
    return movies.filter((movie) => {
      const matchTitle = movie.title.toLowerCase().includes(normalizedQuery);
      const matchOverview = movie.overview
        ?.toLowerCase()
        .includes(normalizedQuery);
      const matchCanonicalId = movie.canonicalId
        .toLowerCase()
        .includes(normalizedQuery);
      const matchGenres = movie.genres?.some((g) =>
        g.toLowerCase().includes(normalizedQuery)
      );
      return matchTitle || matchOverview || matchCanonicalId || matchGenres;
    });
  }, [movies, normalizedQuery]);

  // Filter characters & track matched alias
  const matchingCharacters = useMemo(() => {
    if (!characters || !normalizedQuery) return [];
    return characters
      .map((character) => {
        const matchName = character.name
          .toLowerCase()
          .includes(normalizedQuery);
        const matchRealName = character.realName
          ?.toLowerCase()
          .includes(normalizedQuery);
        const matchSpecies = character.species
          ?.toLowerCase()
          .includes(normalizedQuery);
        const matchOverview = character.overview
          ?.toLowerCase()
          .includes(normalizedQuery);
        const matchCanonicalId = character.canonicalId
          .toLowerCase()
          .includes(normalizedQuery);

        const matchedAlias = character.aliases?.find((a) =>
          a.toLowerCase().includes(normalizedQuery)
        );

        const isMatch =
          matchName ||
          matchRealName ||
          matchSpecies ||
          matchOverview ||
          matchCanonicalId ||
          Boolean(matchedAlias);

        const isAliasMatchOnly =
          !matchName && !matchRealName && Boolean(matchedAlias);

        return {
          character,
          isMatch,
          matchedAlias: isAliasMatchOnly ? matchedAlias : undefined,
        };
      })
      .filter((item) => item.isMatch);
  }, [characters, normalizedQuery]);

  const totalResultsCount = matchingMovies.length + matchingCharacters.length;

  const showMoviesSection =
    (activeCategory === 'all' || activeCategory === 'movies') &&
    matchingMovies.length > 0;

  const showCharactersSection =
    (activeCategory === 'all' || activeCategory === 'characters') &&
    matchingCharacters.length > 0;

  const hasNoResultsInView =
    normalizedQuery !== '' &&
    ((activeCategory === 'all' && totalResultsCount === 0) ||
      (activeCategory === 'movies' && matchingMovies.length === 0) ||
      (activeCategory === 'characters' && matchingCharacters.length === 0));

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <Skeleton.Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </Skeleton.Group>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert
          variant="error"
          title="Unable to Load MarvelVerse Search Data"
          icon={<SearchIcon className="w-5 h-5" />}
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
      <div className="border-b border-stroke-subtle pb-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-starkRed/10 border border-starkRed/30 flex items-center justify-center text-starkRed shrink-0">
            <SearchIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-content-primary">
              Global Search
            </h1>
            <p className="text-sm text-content-secondary mt-0.5">
              Instant multi-entity search across canonical MCU movies,
              characters, aliases, and verified lore.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Controls */}
      <div className="space-y-4">
        <div className="relative w-full">
          <Input
            id="global-search-input"
            aria-label="Search MarvelVerse"
            placeholder="Search movies, characters, aliases (e.g. Iron Man, Tony Stark, Avengers)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4" />}
            className="pr-10 text-base py-2.5"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search query"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-content-muted hover:text-content-primary rounded-full hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <Button
              variant={activeCategory === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Results {normalizedQuery && `(${totalResultsCount})`}
            </Button>
            <Button
              variant={activeCategory === 'movies' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory('movies')}
              leftIcon={<Film className="w-3.5 h-3.5" />}
            >
              Movies {normalizedQuery && `(${matchingMovies.length})`}
            </Button>
            <Button
              variant={
                activeCategory === 'characters' ? 'primary' : 'secondary'
              }
              size="sm"
              onClick={() => setActiveCategory('characters')}
              leftIcon={<Users className="w-3.5 h-3.5" />}
            >
              Characters {normalizedQuery && `(${matchingCharacters.length})`}
            </Button>
          </div>

          {normalizedQuery && totalResultsCount > 0 && (
            <span className="text-xs text-content-muted font-medium">
              {matchingMovies.length}{' '}
              {matchingMovies.length === 1 ? 'movie' : 'movies'} •{' '}
              {matchingCharacters.length}{' '}
              {matchingCharacters.length === 1 ? 'character' : 'characters'}
            </span>
          )}
        </div>
      </div>

      {/* Discovery / Empty Query State */}
      {!normalizedQuery && (
        <Card className="border-stroke-subtle shadow-sm">
          <Card.Body className="p-8 text-center space-y-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-surface-raised border border-stroke-subtle flex items-center justify-center text-vibraniumCyan">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-content-primary">
                Explore the MarvelVerse
              </h2>
              <p className="text-sm text-content-secondary leading-relaxed">
                Type a query above or click a suggested topic below to search
                verified Marvel Cinematic Universe data.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-content-muted">
                Suggested Searches
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SUGGESTED_SEARCHES.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* No Results Found State */}
      {hasNoResultsInView && (
        <div className="py-8">
          <Alert
            variant="info"
            title="No Results Found"
            icon={<SearchIcon className="w-5 h-5" />}
          >
            <div className="space-y-3">
              <p>
                No verified records found matching &ldquo;
                <strong>{searchQuery}</strong>&rdquo;
                {activeCategory !== 'all' &&
                  ` within the ${activeCategory} category`}
                .
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Clear Search
                </Button>
                {activeCategory !== 'all' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveCategory('all')}
                  >
                    View All Categories
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Results Content */}
      {normalizedQuery && !hasNoResultsInView && (
        <div className="space-y-10">
          {/* Movies Section */}
          {showMoviesSection && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-stroke-subtle pb-2.5">
                <h2 className="text-lg font-bold text-content-primary flex items-center gap-2">
                  <Film className="w-5 h-5 text-starkRed" />
                  Movies
                </h2>
                <Badge variant="primary" size="sm">
                  {matchingMovies.length}{' '}
                  {matchingMovies.length === 1 ? 'Result' : 'Results'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingMovies.map((movie) => (
                  <Link
                    key={movie.canonicalId}
                    to={`/movies/${movie.canonicalId}`}
                    className="block group"
                  >
                    <Card interactive className="h-full border-stroke-subtle">
                      <Card.Header
                        bordered
                        className="py-2.5 px-4 flex items-center justify-between"
                      >
                        <Badge variant="primary" size="sm">
                          <Film className="w-3 h-3 mr-1" />
                          Movie
                        </Badge>
                        <span className="text-xs font-mono text-content-muted">
                          {movie.releaseDate
                            ? movie.releaseDate.slice(0, 4)
                            : 'MCU'}
                        </span>
                      </Card.Header>

                      <Card.Body className="p-4 space-y-2.5">
                        <h3 className="font-bold text-base text-content-primary group-hover:text-starkRed transition-colors line-clamp-1">
                          {movie.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-content-muted">
                          {movie.releaseDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-starkRed" />
                              {movie.releaseDate}
                            </span>
                          )}
                          {movie.runtime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-vibraniumCyan" />
                              {movie.runtime} min
                            </span>
                          )}
                        </div>

                        {movie.overview && (
                          <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                            {movie.overview}
                          </p>
                        )}

                        {movie.genres && movie.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {movie.genres.slice(0, 3).map((genre) => (
                              <span
                                key={genre}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-surface-raised text-content-muted font-medium"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </Card.Body>

                      <Card.Footer
                        bordered
                        className="py-2 px-4 flex items-center justify-between text-xs"
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
            </section>
          )}

          {/* Characters Section */}
          {showCharactersSection && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-stroke-subtle pb-2.5">
                <h2 className="text-lg font-bold text-content-primary flex items-center gap-2">
                  <Users className="w-5 h-5 text-vibraniumCyan" />
                  Characters
                </h2>
                <Badge variant="vibranium" size="sm">
                  {matchingCharacters.length}{' '}
                  {matchingCharacters.length === 1 ? 'Result' : 'Results'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingCharacters.map((item) => (
                  <Link
                    key={item.character.canonicalId}
                    to={`/characters/${item.character.canonicalId}`}
                    className="block group"
                  >
                    <Card interactive className="h-full border-stroke-subtle">
                      <Card.Header
                        bordered
                        className="py-2.5 px-4 flex items-center justify-between"
                      >
                        <Badge variant="vibranium" size="sm">
                          <Users className="w-3 h-3 mr-1" />
                          Character
                        </Badge>
                        {item.character.species && (
                          <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                            <Dna className="w-3 h-3 text-vibraniumCyan" />
                            {item.character.species}
                          </span>
                        )}
                      </Card.Header>

                      <Card.Body className="p-4 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={item.character.name}
                            size="md"
                            className="border border-starkRed/30 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base text-content-primary group-hover:text-starkRed transition-colors truncate">
                              {item.character.name}
                            </h3>
                            {item.character.realName &&
                              item.character.realName !==
                                item.character.name && (
                                <p className="text-xs text-content-muted truncate">
                                  {item.character.realName}
                                </p>
                              )}
                          </div>
                        </div>

                        {item.matchedAlias && (
                          <div className="flex items-center gap-1.5 text-xs text-vibraniumCyan bg-vibraniumCyan/10 border border-vibraniumCyan/20 px-2 py-1 rounded-md font-medium">
                            <Tag className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              Matched alias: {item.matchedAlias}
                            </span>
                          </div>
                        )}

                        {item.character.overview && (
                          <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                            {item.character.overview}
                          </p>
                        )}

                        {item.character.aliases &&
                          item.character.aliases.length > 0 &&
                          !item.matchedAlias && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.character.aliases
                                .slice(0, 2)
                                .map((alias) => (
                                  <span
                                    key={alias}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-surface-raised text-content-muted font-medium"
                                  >
                                    {alias}
                                  </span>
                                ))}
                            </div>
                          )}
                      </Card.Body>

                      <Card.Footer
                        bordered
                        className="py-2 px-4 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-[11px] text-content-muted truncate max-w-[150px]">
                          {item.character.canonicalId}
                        </span>
                        <span className="inline-flex items-center gap-1 text-starkRed font-medium group-hover:translate-x-0.5 transition-transform">
                          View Profile <ArrowRight className="w-3 h-3" />
                        </span>
                      </Card.Footer>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
