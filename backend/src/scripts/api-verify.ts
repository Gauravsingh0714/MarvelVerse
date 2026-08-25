import { Server } from 'node:http';
import app from '../app/index.js';

export async function runApiVerification() {
  console.log('====================================================');
  console.log(' MARVELVERSE STAGE 2.8 — REST API VERIFY CLI');
  console.log('====================================================\n');

  let server: Server | null = null;
  let baseUrl = '';

  try {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server?.address();
        if (address && typeof address === 'object') {
          baseUrl = `http://localhost:${address.port}/api/v1`;
        }
        resolve();
      });
    });

    console.log('[API FOUNDATION]');

    const resUniv = await fetch(`${baseUrl}/universes`);
    if (resUniv.status !== 200) throw new Error('GET /api/v1/universes failed');
    console.log('GET /api/v1/universes');
    console.log('PASS\n');

    const resSagas = await fetch(`${baseUrl}/sagas`);
    if (resSagas.status !== 200) throw new Error('GET /api/v1/sagas failed');
    console.log('GET /api/v1/sagas');
    console.log('PASS\n');

    const resPhases = await fetch(`${baseUrl}/phases`);
    if (resPhases.status !== 200) throw new Error('GET /api/v1/phases failed');
    console.log('GET /api/v1/phases');
    console.log('PASS\n');

    console.log('[MOVIES]');

    const resMovies = await fetch(`${baseUrl}/movies`);
    if (resMovies.status !== 200) throw new Error('GET /api/v1/movies failed');
    console.log('GET /api/v1/movies');
    console.log('PASS\n');

    const resMovieId = await fetch(`${baseUrl}/movies/mv-movie-iron-man`);
    if (resMovieId.status !== 200)
      throw new Error('GET /api/v1/movies/mv-movie-iron-man failed');
    console.log('GET /api/v1/movies/mv-movie-iron-man');
    console.log('PASS\n');

    const resMovieTmdb = await fetch(`${baseUrl}/movies/tmdb/1726`);
    if (resMovieTmdb.status !== 200)
      throw new Error('GET /api/v1/movies/tmdb/1726 failed');
    console.log('GET /api/v1/movies/tmdb/1726');
    console.log('PASS\n');

    const resMoviePhase = await fetch(`${baseUrl}/movies?phaseId=phase-1`);
    if (resMoviePhase.status !== 200)
      throw new Error('GET /api/v1/movies?phaseId=phase-1 failed');
    console.log('GET /api/v1/movies?phaseId=phase-1');
    console.log('PASS\n');

    console.log('[CHARACTERS]');

    const resChars = await fetch(`${baseUrl}/characters`);
    if (resChars.status !== 200)
      throw new Error('GET /api/v1/characters failed');
    console.log('GET /api/v1/characters');
    console.log('PASS\n');

    const resCharId = await fetch(
      `${baseUrl}/characters/mv-character-tony-stark`
    );
    if (resCharId.status !== 200)
      throw new Error('GET /api/v1/characters/mv-character-tony-stark failed');
    console.log('GET /api/v1/characters/mv-character-tony-stark');
    console.log('PASS\n');

    console.log('[APPEARANCES]');

    const resApps = await fetch(`${baseUrl}/appearances`);
    if (resApps.status !== 200)
      throw new Error('GET /api/v1/appearances failed');
    console.log('GET /api/v1/appearances');
    console.log('PASS\n');

    const resTonyApps = await fetch(
      `${baseUrl}/characters/mv-character-tony-stark/appearances`
    );
    if (resTonyApps.status !== 200)
      throw new Error(
        'GET /api/v1/characters/mv-character-tony-stark/appearances failed'
      );
    console.log('GET /api/v1/characters/mv-character-tony-stark/appearances');
    console.log('PASS\n');

    console.log('[ERROR HANDLING]');

    const resInvalidTmdb = await fetch(`${baseUrl}/movies/tmdb/invalid`);
    if (resInvalidTmdb.status !== 400)
      throw new Error('Invalid TMDB ID test failed');
    console.log('Invalid TMDB ID');
    console.log('PASS\n');

    const resUnknownMovie = await fetch(
      `${baseUrl}/movies/mv-movie-non-existent`
    );
    if (resUnknownMovie.status !== 404)
      throw new Error('Unknown resource test failed');
    console.log('Unknown resource');
    console.log('PASS\n');

    const resUnknownRoute = await fetch(`${baseUrl}/does-not-exist`);
    if (resUnknownRoute.status !== 404)
      throw new Error('Unknown route test failed');
    console.log('Unknown route');
    console.log('PASS\n');

    console.log('====================================================');
    console.log(' MARVELVERSE STAGE 2.8 REST API VERIFICATION COMPLETE');
    console.log('====================================================\n');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('\n[API VERIFICATION FAILURE]:', msg);
    process.exit(1);
  } finally {
    if (server) {
      (server as Server).close();
    }
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('api-verify.ts')
) {
  runApiVerification();
}
