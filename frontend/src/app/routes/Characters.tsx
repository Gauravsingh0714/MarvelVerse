import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../../hooks/useCharacters.js';
import {
  Card,
  Badge,
  Avatar,
  Button,
  Input,
  Select,
  Alert,
  Skeleton,
} from '../../components/ui/index.js';
import {
  Users,
  Search,
  RefreshCw,
  Dna,
  Tag,
  ArrowRight,
  FilterX,
} from 'lucide-react';

export default function Characters() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('');

  const {
    data: characters,
    isLoading: isCharactersLoading,
    error: charactersError,
    refetch: refetchCharacters,
  } = useCharacters();

  // Extract unique species present in the loaded dataset
  const uniqueSpecies = useMemo(() => {
    if (!characters) return [];
    const speciesSet = new Set<string>();
    characters.forEach((c) => {
      if (c.species) speciesSet.add(c.species);
    });
    return Array.from(speciesSet).sort();
  }, [characters]);

  // Local filtering for name, real name, species, and aliases
  const filteredCharacters = useMemo(() => {
    if (!characters) return [];
    const query = searchQuery.trim().toLowerCase();

    return characters.filter((c) => {
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        (c.realName && c.realName.toLowerCase().includes(query)) ||
        (c.species && c.species.toLowerCase().includes(query)) ||
        (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(query)));

      const matchesSpecies = !speciesFilter || c.species === speciesFilter;

      return matchesSearch && matchesSpecies;
    });
  }, [characters, searchQuery, speciesFilter]);

  if (isCharactersLoading) {
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

  if (charactersError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Alert
          variant="error"
          title="Unable to Load Marvel Canonical Characters"
          icon={<Users className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <p>
              {charactersError.message ||
                'Please check if the MarvelVerse API server is running.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchCharacters}
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
            <Users className="w-8 h-8 text-starkRed" />
            Marvel Canonical Characters
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            Verified character directory powered by MarvelVerse Canonical Domain
            Layer.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search name, alias, or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="">All Species</option>
              {uniqueSpecies.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Characters Grid / Empty States */}
      {!filteredCharacters || filteredCharacters.length === 0 ? (
        <div className="py-12">
          <Alert variant="info" title="No Canonical Characters Found">
            <div className="space-y-3">
              <p>
                No verified character records match your current search query ("
                {searchQuery}") or species filter.
              </p>
              {(searchQuery || speciesFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSpeciesFilter('');
                  }}
                  leftIcon={<FilterX className="w-4 h-4" />}
                >
                  Clear Search & Filters
                </Button>
              )}
            </div>
          </Alert>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <Link
              key={character.canonicalId}
              to={`/characters/${character.canonicalId}`}
            >
              <Card interactive className="h-full group border-stroke-subtle">
                <Card.Header bordered className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    {character.species && (
                      <Badge variant="vibranium" size="sm">
                        <Dna className="w-3 h-3 mr-1" />
                        {character.species}
                      </Badge>
                    )}
                  </div>
                  {character.externalIds?.tmdb && (
                    <span className="text-[11px] font-mono text-content-muted">
                      TMDB #{character.externalIds.tmdb}
                    </span>
                  )}
                </Card.Header>

                <Card.Body className="space-y-3 p-5">
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      name={character.name}
                      size="md"
                      className="border border-starkRed/30"
                    />
                    <div className="space-y-0.5">
                      <h2 className="text-xl font-bold text-content-primary tracking-tight group-hover:text-starkRed transition-colors">
                        {character.name}
                      </h2>
                      {character.realName && (
                        <p className="text-xs font-medium text-content-muted">
                          {character.realName}
                        </p>
                      )}
                    </div>
                  </div>

                  {character.overview && (
                    <p className="text-xs text-content-secondary line-clamp-3 leading-relaxed pt-1">
                      {character.overview}
                    </p>
                  )}
                </Card.Body>

                <Card.Footer bordered className="py-3 px-5">
                  <div className="flex flex-wrap gap-1.5 flex-1 mr-2">
                    {character.aliases && character.aliases.length > 0 ? (
                      character.aliases.slice(0, 2).map((alias) => (
                        <Badge key={alias} variant="default" size="sm">
                          <Tag className="w-2.5 h-2.5 mr-1" />
                          {alias}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-[11px] font-mono text-content-muted">
                        ID: {character.canonicalId}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-starkRed group-hover:translate-x-0.5 transition-transform">
                    Profile
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
