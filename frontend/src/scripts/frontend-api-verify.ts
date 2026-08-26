import { Server } from 'node:http';
import app from '../../../backend/src/app/index.js';
import { ApiClient } from '../api/client.js';
import { FoundationService } from '../services/foundation.service.js';
import { MovieService } from '../services/movie.service.js';
import { CharacterService } from '../services/character.service.js';
import { AppearanceService } from '../services/appearance.service.js';

export async function runFrontendApiVerification() {
  console.log('====================================================');
  console.log(' MARVELVERSE STAGE 2.9 — FRONTEND API VERIFY CLI');
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

    const client = new ApiClient(baseUrl);
    const foundation = new FoundationService(client);
    const movie = new MovieService(client);
    const character = new CharacterService(client);
    const appearance = new AppearanceService(client);

    console.log('[FOUNDATION SERVICE]');
    const universes = await foundation.getUniverses();
    console.log(` -> getUniverses(): ${universes.length} items`);
    const sagas = await foundation.getSagas();
    console.log(` -> getSagas(): ${sagas.length} items`);
    const phases = await foundation.getPhases();
    console.log(` -> getPhases(): ${phases.length} items`);
    console.log('PASS\n');

    console.log('[MOVIE SERVICE]');
    const movies = await movie.getMovies({ sort: 'releaseOrder' });
    console.log(
      ` -> getMovies({ sort: 'releaseOrder' }): ${movies.length} items`
    );

    const ironMan = await movie.getMovieByCanonicalId('mv-movie-iron-man');
    console.log(
      ` -> getMovieByCanonicalId('mv-movie-iron-man'): "${ironMan.title}"`
    );

    const tmdbMovie = await movie.getMovieByTmdbId(1726);
    console.log(` -> getMovieByTmdbId(1726): "${tmdbMovie.title}"`);
    console.log('PASS\n');

    console.log('[CHARACTER SERVICE]');
    const characters = await character.getCharacters();
    console.log(` -> getCharacters(): ${characters.length} items`);

    const tony = await character.getCharacterByCanonicalId(
      'mv-character-tony-stark'
    );
    console.log(
      ` -> getCharacterByCanonicalId('mv-character-tony-stark'): "${tony.name}"`
    );
    console.log('PASS\n');

    console.log('[APPEARANCE SERVICE]');
    const appearances = await appearance.getAppearances();
    console.log(` -> getAppearances(): ${appearances.length} items`);

    const tonyApps = await character.getCharacterAppearances(
      'mv-character-tony-stark'
    );
    console.log(
      ` -> getCharacterAppearances('mv-character-tony-stark'): ${tonyApps.length} appearances`
    );
    console.log('PASS\n');

    console.log('====================================================');
    console.log(' MARVELVERSE FRONTEND API INTEGRATION SUMMARY');
    console.log('====================================================');
    console.log('Foundation Service:  PASS');
    console.log('Movie Service:       PASS');
    console.log('Character Service:   PASS');
    console.log('Appearance Service:  PASS');
    console.log('====================================================\n');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('\n[FRONTEND API VERIFICATION FAILURE]:', msg);
    process.exit(1);
  } finally {
    if (server) {
      (server as Server).close();
    }
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('frontend-api-verify.ts')
) {
  runFrontendApiVerification();
}
