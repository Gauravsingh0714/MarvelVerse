import { useCharacters } from '../../hooks/useCharacters.js';
import { RouteLoading } from '../components/RouteLoading.js';
import { Users, RefreshCw, Dna } from 'lucide-react';

export default function Characters() {
  const { data: characters, isLoading, error, refetch } = useCharacters();

  if (isLoading) {
    return <RouteLoading label="Loading verified MarvelVerse characters..." />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4 bg-red-950/40 border border-red-800/50 rounded-xl my-8">
        <h3 className="text-xl font-bold text-red-200">
          Unable to load characters
        </h3>
        <p className="text-sm text-red-300/80">
          {error.message ||
            'Please check if the MarvelVerse API server is running.'}
        </p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/60 hover:bg-red-800/80 text-red-100 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-red-500" />
          Marvel Canonical Characters
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verified character directory powered by MarvelVerse Canonical Domain
          Layer.
        </p>
      </div>

      {/* Characters Grid */}
      {!characters || characters.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No canonical characters found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <article
              key={character.canonicalId}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {character.name}
                    </h2>
                    {character.realName && (
                      <p className="text-xs font-medium text-slate-400">
                        {character.realName}
                      </p>
                    )}
                  </div>
                  {character.species && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/40">
                      <Dna className="w-3 h-3" />
                      {character.species}
                    </span>
                  )}
                </div>

                {character.overview && (
                  <p className="text-xs text-slate-300/80 leading-relaxed line-clamp-3">
                    {character.overview}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>ID: {character.canonicalId}</span>
                {character.externalIds?.tmdb && (
                  <span>TMDB: #{character.externalIds.tmdb}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
