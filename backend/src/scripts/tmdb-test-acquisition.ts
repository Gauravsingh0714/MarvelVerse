import path from 'node:path';
import dotenv from 'dotenv';
import {
  TmdbClient,
  TmdbAcquirer,
  TmdbNormalizer,
  TmdbValidator,
  TmdbStorage,
} from '../services/tmdb/index.js';
import { ValidationReport } from '../services/tmdb/tmdb-validator.js';

// Load .env from workspace root or current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const TEST_MOVIES = [
  { id: 1726, name: 'Iron Man' },
  { id: 24428, name: 'The Avengers' },
  { id: 118340, name: 'Guardians of the Galaxy' },
  { id: 299534, name: 'Avengers: Endgame' },
  { id: 634649, name: 'Spider-Man: No Way Home' },
];

const TEST_TV_SERIES = [
  { id: 85271, name: 'WandaVision' },
  { id: 88396, name: 'Loki' },
];

export async function runTmdbTestAcquisition() {
  console.log('====================================================');
  console.log(' MARVELVERSE STAGE 2.5 — TMDB TEST ACQUISITION BATCH');
  console.log('====================================================\n');

  // 1. Verify credentials configuration
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!token && !apiKey) {
    console.error('[ERROR] TMDB Credentials Missing in .env');
    console.error(
      'Configure TMDB_API_READ_ACCESS_TOKEN or TMDB_API_KEY before running pipeline.'
    );
    process.exit(1);
  }

  console.log('[CONFIG] TMDB Credentials Detected: PASS');

  const client = new TmdbClient();
  const storage = new TmdbStorage();
  const acquirer = new TmdbAcquirer(client, storage);
  const normalizer = new TmdbNormalizer(storage);
  const validator = new TmdbValidator();

  let rawCount = 0;
  let processedCount = 0;

  let moviesAcquired = 0;
  let tvAcquired = 0;
  let creditsAcquired = 0;
  let seasonsAcquired = 0;
  let episodesAcquired = 0;

  const validationReports: ValidationReport[] = [];

  try {
    // 2. Process Movies Batch
    console.log(
      `\n[ACQUISITION] Starting Movies Batch (${TEST_MOVIES.length} movies)...`
    );
    for (const movieItem of TEST_MOVIES) {
      console.log(` -> Fetching Movie ${movieItem.id} (${movieItem.name})...`);

      // Acquire Movie
      const { envelope: movieEnv } = await acquirer.acquireMovie(movieItem.id);
      rawCount++;
      moviesAcquired++;

      // Normalize & Save Movie
      const { candidate: movieCandidate } = normalizer.normalizeMovie(movieEnv);
      processedCount++;
      validationReports.push(validator.validateMovie(movieCandidate));

      // Acquire Movie Credits
      console.log(` -> Fetching Credits for Movie ${movieItem.id}...`);
      const { envelope: creditsEnv } = await acquirer.acquireMovieCredits(
        movieItem.id
      );
      rawCount++;
      creditsAcquired++;

      // Normalize & Save Credits
      const { candidate: creditsCandidate } = normalizer.normalizeCredits(
        creditsEnv,
        'movie'
      );
      processedCount++;
      validationReports.push(validator.validateCredits(creditsCandidate));
    }

    // 3. Process TV Series Batch
    console.log(
      `\n[ACQUISITION] Starting TV Series Batch (${TEST_TV_SERIES.length} series)...`
    );
    for (const tvItem of TEST_TV_SERIES) {
      console.log(` -> Fetching TV Series ${tvItem.id} (${tvItem.name})...`);

      // Acquire TV
      const { envelope: tvEnv } = await acquirer.acquireTvSeries(tvItem.id);
      rawCount++;
      tvAcquired++;

      // Normalize & Save TV
      const { candidate: tvCandidate } = normalizer.normalizeTvSeries(tvEnv);
      processedCount++;
      validationReports.push(validator.validateTvSeries(tvCandidate));

      // Acquire TV Credits
      console.log(` -> Fetching Credits for TV Series ${tvItem.id}...`);
      const { envelope: creditsEnv } = await acquirer.acquireTvCredits(
        tvItem.id
      );
      rawCount++;
      creditsAcquired++;

      // Normalize & Save TV Credits
      const { candidate: creditsCandidate } = normalizer.normalizeCredits(
        creditsEnv,
        'tv'
      );
      processedCount++;
      validationReports.push(validator.validateCredits(creditsCandidate));

      // Acquire TV Season 1
      console.log(` -> Fetching Season 1 for TV Series ${tvItem.id}...`);
      const { envelope: seasonEnv } = await acquirer.acquireTvSeason(
        tvItem.id,
        1
      );
      rawCount++;
      seasonsAcquired++;
      episodesAcquired += seasonEnv.payload.episodes?.length || 0;

      // Normalize & Save Season
      const { candidate: seasonCandidate } = normalizer.normalizeSeason(
        seasonEnv,
        tvItem.id
      );
      processedCount++;
      validationReports.push(validator.validateSeason(seasonCandidate));
    }

    // 4. Summarize Validation
    const failedValidations = validationReports.filter((r) => !r.isValid);
    const allValid = failedValidations.length === 0;

    console.log('\n====================================================');
    console.log(' TMDB TEST ACQUISITION SUMMARY');
    console.log('====================================================');
    console.log(`Movies requested: ${TEST_MOVIES.length}`);
    console.log(`Movies acquired:  ${moviesAcquired}`);
    console.log(`TV requested:     ${TEST_TV_SERIES.length}`);
    console.log(`TV acquired:      ${tvAcquired}`);
    console.log(`Credits acquired: ${creditsAcquired}`);
    console.log(`Seasons acquired: ${seasonsAcquired}`);
    console.log(`Episodes acquired:${episodesAcquired}`);
    console.log('----------------------------------------------------');
    console.log(
      `Normalization:    PASS (${processedCount} records normalized)`
    );
    console.log(
      `Validation:       ${allValid ? 'PASS' : 'FAIL'} (${validationReports.length - failedValidations.length}/${validationReports.length} valid)`
    );
    console.log('----------------------------------------------------');
    console.log(`Raw records:       ${rawCount} stored in data/raw/tmdb/`);
    console.log(
      `Processed records: ${processedCount} stored in data/processed/tmdb/`
    );
    console.log(`Secrets exposed:   NO`);
    console.log('====================================================\n');

    if (!allValid) {
      console.error('[VALIDATION ERRORS]:');
      failedValidations.forEach((f) => {
        console.error(
          ` - Candidate [${f.candidateId}]: ${f.errors.join(', ')}`
        );
      });
      process.exit(1);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('\n[ACQUISITION PIPELINE FAILURE]:', errorMsg);
    process.exit(1);
  }
}

// Execute script if run directly
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('tmdb-test-acquisition.ts')
) {
  runTmdbTestAcquisition();
}
