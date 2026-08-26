import { useState } from 'react';
import { useMovies } from '../../hooks/useMovies.js';
import { RouteLoading } from '../components/RouteLoading.js';
import { Film, RefreshCw, Calendar, Tag } from 'lucide-react';

export default function Movies() {
  const [phaseFilter, setPhaseFilter] = useState<string>('');
  const {
    data: movies,
    isLoading,
    error,
    refetch,
  } = useMovies({
    phaseId: phaseFilter || undefined,
    sort: 'releaseOrder',
  });

  if (isLoading) {
    return <RouteLoading label="Loading verified MarvelVerse movies..." />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4 bg-red-950/40 border border-red-800/50 rounded-xl my-8">
        <h3 className="text-xl font-bold text-red-200">
          Unable to load movies
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            Marvel Canonical Movies
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verified Marvel Cinematic Universe releases powered by TMDB &
            Canonical Data Architecture.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="phase-filter"
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >
            Filter Phase:
          </label>
          <select
            id="phase-filter"
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="">All Phases</option>
            <option value="phase-1">Phase 1</option>
            <option value="phase-2">Phase 2</option>
            <option value="phase-3">Phase 3</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {!movies || movies.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No canonical movies found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <article
              key={movie.canonicalId}
              className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col"
            >
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/40">
                      Release #{movie.releaseOrder}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {movie.phaseId.toUpperCase()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {movie.title}
                  </h2>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {movie.releaseDate}
                    </span>
                    {movie.runtime && <span>{movie.runtime} min</span>}
                  </div>

                  <p className="text-xs text-slate-300/80 line-clamp-3 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Genres & External ID Metadata */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 bg-slate-800 text-slate-300 rounded"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                    <span>ID: {movie.canonicalId}</span>
                    {movie.externalIds?.tmdb && (
                      <span>TMDB: #{movie.externalIds.tmdb}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
