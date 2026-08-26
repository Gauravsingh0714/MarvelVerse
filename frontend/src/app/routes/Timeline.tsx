import { useMovies } from '../../hooks/useMovies.js';
import { RouteLoading } from '../components/RouteLoading.js';
import { Clock, Calendar, RefreshCw } from 'lucide-react';

export default function Timeline() {
  const {
    data: movies,
    isLoading,
    error,
    refetch,
  } = useMovies({
    sort: 'releaseOrder',
  });

  if (isLoading) {
    return (
      <RouteLoading label="Loading Marvel Cinematic Universe timeline..." />
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4 bg-red-950/40 border border-red-800/50 rounded-xl my-8">
        <h3 className="text-xl font-bold text-red-200">
          Unable to load timeline
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Clock className="w-8 h-8 text-red-500" />
          MCU Chronological Release Timeline
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verified MCU Release Order timeline fetched dynamically via Stage 2.8
          REST API.
        </p>
      </div>

      {/* Timeline Node List */}
      {!movies || movies.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No timeline records available.
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
          {movies.map((movie) => (
            <div key={movie.canonicalId} className="relative group">
              {/* Timeline Marker Badge */}
              <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-red-600 border-4 border-slate-950 text-white font-bold text-[10px] flex items-center justify-center shadow">
                {movie.releaseOrder}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-md hover:border-slate-700 transition-all space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-red-400 uppercase tracking-wide">
                    {movie.phaseId} • Order #{movie.releaseOrder}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {movie.releaseDate}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">{movie.title}</h2>

                <p className="text-xs text-slate-300/80 leading-relaxed">
                  {movie.overview}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Canonical ID: {movie.canonicalId}</span>
                  <span>Universe: {movie.universeId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
