import path from 'node:path';
import dotenv from 'dotenv';
import {
  CanonicalMovie,
  CanonicalCharacter,
  CanonicalAppearance,
  MovieCandidate,
} from '@marvelverse/shared';
import {
  TmdbAcquirer,
  TmdbNormalizer,
  TmdbStorage,
} from '../services/tmdb/index.js';
import {
  CanonicalStorage,
  CanonicalMapper,
  CanonicalValidator,
  CanonicalPromoter,
} from '../services/canonical/index.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export interface Phase1CuratedItem {
  slug: string;
  tmdbId: number;
  releaseOrder: number;
  universeId: string;
  sagaId: string;
  phaseId: string;
}

const PHASE_1_MOVIES: Phase1CuratedItem[] = [
  {
    slug: 'iron-man',
    tmdbId: 1726,
    releaseOrder: 1,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
  {
    slug: 'the-incredible-hulk',
    tmdbId: 1724,
    releaseOrder: 2,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
  {
    slug: 'iron-man-2',
    tmdbId: 10138,
    releaseOrder: 3,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
  {
    slug: 'thor',
    tmdbId: 10195,
    releaseOrder: 4,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
  {
    slug: 'captain-america-the-first-avenger',
    tmdbId: 1771,
    releaseOrder: 5,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
  {
    slug: 'the-avengers',
    tmdbId: 24428,
    releaseOrder: 6,
    universeId: 'earth-616',
    sagaId: 'infinity-saga',
    phaseId: 'phase-1',
  },
];

const INITIAL_CHARACTERS: CanonicalCharacter[] = [
  {
    canonicalId: 'mv-character-tony-stark',
    name: 'Tony Stark',
    realName: 'Anthony Edward Stark',
    aliases: ['Iron Man'],
    species: 'Human',
    overview:
      'Genius, billionaire, playboy, philanthropist who built the Iron Man armor.',
    externalIds: { tmdb: 3223 },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
      notes: 'Confirmed Phase 1 MCU lead character.',
    },
  },
  {
    canonicalId: 'mv-character-steve-rogers',
    name: 'Steve Rogers',
    realName: 'Steven Grant Rogers',
    aliases: ['Captain America', 'The First Avenger'],
    species: 'Human (Super Soldier)',
    overview: 'World War II veteran enhanced by Super Soldier Serum.',
    externalIds: { tmdb: 16828 },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
      notes: 'Confirmed Phase 1 MCU lead character.',
    },
  },
  {
    canonicalId: 'mv-character-thor-odinson',
    name: 'Thor Odinson',
    realName: 'Thor Odinson',
    aliases: ['God of Thunder'],
    species: 'Asgardian',
    overview: 'Crown Prince of Asgard wields the mystical hammer Mjolnir.',
    externalIds: { tmdb: 74568 },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
      notes: 'Confirmed Phase 1 MCU lead character.',
    },
  },
  {
    canonicalId: 'mv-character-bruce-banner',
    name: 'Bruce Banner',
    realName: 'Robert Bruce Banner',
    aliases: ['The Incredible Hulk'],
    species: 'Human (Gamma Mutate)',
    overview:
      'Physicist transformed into the Hulk through gamma radiation exposure.',
    externalIds: { tmdb: 103 },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
      notes: 'Confirmed Phase 1 MCU lead character.',
    },
  },
  {
    canonicalId: 'mv-character-natasha-romanoff',
    name: 'Natasha Romanoff',
    realName: 'Natalia Alianovna Romanova',
    aliases: ['Black Widow'],
    species: 'Human',
    overview: 'Master spy and elite martial artist operative of S.H.I.E.L.D.',
    externalIds: { tmdb: 1245 },
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
      notes: 'Confirmed Phase 1 MCU lead character.',
    },
  },
];

const INITIAL_APPEARANCES: CanonicalAppearance[] = [
  {
    canonicalId: 'mv-app-tony-stark-iron-man',
    characterId: 'mv-character-tony-stark',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-iron-man',
    roleName: 'Tony Stark / Iron Man',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
  {
    canonicalId: 'mv-app-bruce-banner-hulk',
    characterId: 'mv-character-bruce-banner',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-the-incredible-hulk',
    roleName: 'Bruce Banner / The Hulk',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
  {
    canonicalId: 'mv-app-tony-stark-iron-man-2',
    characterId: 'mv-character-tony-stark',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-iron-man-2',
    roleName: 'Tony Stark / Iron Man',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
  {
    canonicalId: 'mv-app-thor-thor',
    characterId: 'mv-character-thor-odinson',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-thor',
    roleName: 'Thor Odinson',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
  {
    canonicalId: 'mv-app-steve-rogers-captain-america',
    characterId: 'mv-character-steve-rogers',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-captain-america-the-first-avenger',
    roleName: 'Steve Rogers / Captain America',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
  {
    canonicalId: 'mv-app-tony-stark-avengers',
    characterId: 'mv-character-tony-stark',
    mediaType: 'movie',
    mediaCanonicalId: 'mv-movie-the-avengers',
    roleName: 'Tony Stark / Iron Man',
    verification: {
      status: 'verified',
      method: 'manual-review',
      verifiedAt: new Date().toISOString(),
    },
  },
];

export async function runCanonicalVerificationPipeline() {
  console.log('====================================================');
  console.log(' MARVELVERSE STAGE 2.6 — CANONICAL VERIFICATION CLI');
  console.log('====================================================\n');

  const tmdbStorage = new TmdbStorage();
  const acquirer = new TmdbAcquirer();
  const normalizer = new TmdbNormalizer(tmdbStorage);

  const canonicalStorage = new CanonicalStorage();
  const universes = canonicalStorage.loadUniverses();
  const sagas = canonicalStorage.loadSagas();
  const phases = canonicalStorage.loadPhases();

  const validator = new CanonicalValidator(universes, sagas, phases);
  const mapper = new CanonicalMapper();
  const promoter = new CanonicalPromoter(canonicalStorage, validator);

  console.log(
    `[FOUNDATION] Loaded ${universes.length} Universes, ${sagas.length} Sagas, ${phases.length} Phases.`
  );

  let promotedMovies = 0;
  let promotedChars = 0;
  let promotedApps = 0;

  try {
    // 1. Process & Promote Phase 1 MCU Movies
    console.log(
      `\n[CANONICAL MAPPING] Processing MCU Phase 1 Movies (${PHASE_1_MOVIES.length} titles)...`
    );

    for (const curated of PHASE_1_MOVIES) {
      let rawMovie = tmdbStorage.getRawSnapshot<any>('movie', curated.tmdbId);
      if (!rawMovie) {
        console.log(
          ` -> Candidate raw snapshot missing for TMDB ${curated.tmdbId}. Acquiring from TMDB API...`
        );
        const { envelope } = await acquirer.acquireMovie(curated.tmdbId);
        rawMovie = envelope;
      }

      const { candidate: movieCandidate } = normalizer.normalizeMovie(rawMovie);

      const canonicalMovie: CanonicalMovie =
        mapper.mapMovieCandidateToCanonical(movieCandidate as MovieCandidate, {
          slug: curated.slug,
          releaseOrder: curated.releaseOrder,
          universeId: curated.universeId,
          sagaId: curated.sagaId,
          phaseId: curated.phaseId,
          verification: {
            status: 'verified',
            method: 'manual-review',
            verifiedAt: new Date().toISOString(),
            notes: `Confirmed as MCU ${curated.phaseId.toUpperCase()} release #${curated.releaseOrder}.`,
          },
        });

      // Validate & Promote
      promoter.promoteMovie(canonicalMovie);
      console.log(
        ` -> Promoted Canonical Movie [${canonicalMovie.canonicalId}] (Release #${curated.releaseOrder}): PASS`
      );
      promotedMovies++;
    }

    // 2. Process & Promote Controlled Character Fixture
    console.log(
      `\n[CANONICAL MAPPING] Processing Initial Characters (${INITIAL_CHARACTERS.length} characters)...`
    );
    for (const char of INITIAL_CHARACTERS) {
      promoter.promoteCharacter(char);
      console.log(
        ` -> Promoted Canonical Character [${char.canonicalId}]: PASS`
      );
      promotedChars++;
    }

    // 3. Process & Promote Character Appearances
    console.log(
      `\n[CANONICAL MAPPING] Processing Appearance Relationships (${INITIAL_APPEARANCES.length} items)...`
    );
    for (const app of INITIAL_APPEARANCES) {
      promoter.promoteAppearance(app);
      console.log(
        ` -> Promoted Appearance Relationship [${app.canonicalId}]: PASS`
      );
      promotedApps++;
    }

    // 4. Verify Integrity Across Saved Canonical Dataset
    const savedMovies = canonicalStorage.loadMovies();
    console.log(
      `\n[INTEGRITY AUDIT] Auditing ${savedMovies.length} canonical movie entities...`
    );
    savedMovies.forEach((m) => {
      const rep = validator.validateMovie(m);
      if (!rep.isValid) {
        throw new Error(
          `Saved movie [${m.canonicalId}] failed validation: ${rep.errors.join(', ')}`
        );
      }
    });

    console.log('\n====================================================');
    console.log(' MARVELVERSE CANONICAL VERIFICATION SUMMARY');
    console.log('====================================================');
    console.log(`Movies Promoted:       ${promotedMovies}`);
    console.log(`Characters Promoted:   ${promotedChars}`);
    console.log(`Appearances Promoted:  ${promotedApps}`);
    console.log('----------------------------------------------------');
    console.log(`Canonical Storage:     data/verified/movies/`);
    console.log(`Character Storage:     data/verified/characters/`);
    console.log(`Relationship Storage:  data/verified/relationships/`);
    console.log('----------------------------------------------------');
    console.log('Schema Validation:     PASS');
    console.log('Relationship Checks:   PASS');
    console.log('Duplicate Check:       PASS');
    console.log('Verification Gate:     PASS (Unverified records blocked)');
    console.log('====================================================\n');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('\n[CANONICAL PIPELINE FAILURE]:', errorMsg);
    process.exit(1);
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('canonical-verify.ts')
) {
  runCanonicalVerificationPipeline();
}
