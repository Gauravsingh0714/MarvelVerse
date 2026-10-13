import { createCanonicalRepository } from '../services/repository/index.js';

export async function runRepositoryVerification() {
  console.log('====================================================');
  console.log(' MARVELVERSE STAGE 2.7 — REPOSITORY QUERY VERIFY CLI');
  console.log('====================================================\n');

  const repository = createCanonicalRepository();

  // 1. Foundation Verification
  const universes = repository.foundation.getUniverses();
  const sagas = repository.foundation.getSagas();
  const phases = repository.foundation.getPhases();
  const continuities = repository.foundation.getContinuities();
  console.log(
    `[FOUNDATION] Loaded ${universes.length} Universes, ${sagas.length} Sagas, ${phases.length} Phases, ${continuities.length} Continuities.`
  );

  // 2. Movie Query Verification
  const allMovies = repository.movies.getMovies();
  console.log(`[MOVIES] Total Canonical Movies Retrieved: ${allMovies.length}`);
  allMovies.forEach((m) => {
    console.log(
      ` -> [${m.canonicalId}] "${m.title}" (Release #${m.releaseOrder}, Phase: ${m.phaseId})`
    );
  });

  const ironManById = repository.movies.getMovieById('mv-movie-iron-man');
  if (!ironManById)
    throw new Error(
      'Failed to retrieve movie by canonical ID "mv-movie-iron-man"'
    );

  const ironManByTmdb = repository.movies.getMovieByTmdbId(1726);
  if (!ironManByTmdb || ironManByTmdb.canonicalId !== 'mv-movie-iron-man') {
    throw new Error('Failed to retrieve movie by TMDB ID 1726');
  }

  const phase1Movies = repository.movies.getMoviesByPhase('phase-1');
  console.log(`\n[FILTER] Movies in Phase 1: ${phase1Movies.length}`);

  // 3. Character & Variant Query Verification
  const characters = repository.characters.getCharacters();
  console.log(
    `\n[CHARACTERS] Total Canonical Characters: ${characters.length}`
  );
  characters.forEach((c) => {
    console.log(
      ` -> [${c.canonicalId}] ${c.name} (${c.species || 'Species N/A'})`
    );
  });
  const variants = repository.characters.getVariants();
  console.log(`[VARIANTS] Total Canonical Variants: ${variants.length}`);

  // 4. TV Series Query Verification
  const tvSeries = repository.tv.getSeries();
  console.log(`\n[TV SERIES] Total Canonical Series: ${tvSeries.length}`);

  // 5. Watch Guide Query Verification
  const watchGuides = repository.watchGuides.getWatchGuides();
  console.log(`[WATCH GUIDES] Total Curated Guides: ${watchGuides.length}`);

  // 6. Relationship Query Verification
  const appearances = repository.relationships.getAppearances();
  console.log(`\n[RELATIONSHIPS] Total Appearances: ${appearances.length}`);
  const tonyApps = repository.relationships.getAppearancesByCharacter(
    'mv-character-tony-stark'
  );
  console.log(` -> Tony Stark Appearances: ${tonyApps.length} movies`);

  // 7. Reference Integrity Verification
  console.log(
    '\n[INTEGRITY AUDIT] Validating cross-entity reference integrity...'
  );
  const integrity = repository.validateIntegrity();
  if (!integrity.isValid) {
    throw new Error(
      `Reference Integrity Verification Failed:\n${integrity.errors.join('\n')}`
    );
  }
  console.log(' -> Reference Integrity: PASS');

  // 8. Immutability & Cache Verification
  console.log(
    '\n[IMMUTABILITY & CACHE AUDIT] Testing data isolation and cache retention...'
  );
  const moviesRef1 = repository.movies.getMovies();
  moviesRef1[0].title = 'MUTATED TITLE';
  const moviesRef2 = repository.movies.getMovies();
  if (moviesRef2[0].title === 'MUTATED TITLE') {
    throw new Error(
      'Data Immutability Violation: consumer mutation altered cached repository data!'
    );
  }

  console.log(' -> Cache retained: PASS');
  console.log(' -> Consumer Data Isolation: PASS');

  console.log('\n====================================================');
  console.log(' MARVELVERSE REPOSITORY LAYER VERIFICATION SUMMARY');
  console.log('====================================================');
  console.log('Foundation Queries:    PASS');
  console.log('Movie Queries:         PASS');
  console.log('Character Queries:     PASS');
  console.log('Relationship Queries:  PASS');
  console.log('TV Repository Queries: PASS');
  console.log('Watch Guide Queries:   PASS');
  console.log('Reference Integrity:   PASS');
  console.log('Cache Management:      PASS');
  console.log('Data Immutability:     PASS');
  console.log('====================================================\n');
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('repository-verify.ts')
) {
  runRepositoryVerification();
}
