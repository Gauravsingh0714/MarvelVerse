import { createCanonicalRepository } from '../services/repository/index.js';
import { MediaResolver } from '../services/media/index.js';

export async function runMediaVerification() {
  console.log('====================================================');
  console.log(' MARVELVERSE BATCH 3 — MEDIA ASSET VERIFY CLI');
  console.log('====================================================\n');

  const repository = createCanonicalRepository();
  const resolver = new MediaResolver();

  // 1. Direct Resolver Unit Verification
  console.log(
    '[RESOLVER] Testing authoritative media resolver & TMDB adapter...'
  );
  const testPoster = resolver.resolve(
    {
      assetId: 'test-mv-iron-man-poster',
      provider: 'tmdb',
      path: '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
      mediaType: 'poster',
      altText: 'Iron Man verified poster',
    },
    { size: 'large' }
  );

  if (
    testPoster.availability !== 'available' ||
    !testPoster.resolvedUrl?.includes('w780')
  ) {
    throw new Error(
      `Resolver failed on valid TMDB poster: ${JSON.stringify(testPoster)}`
    );
  }
  console.log(` -> Verified TMDB Large Poster URL: ${testPoster.resolvedUrl}`);

  // Test Fallback on Missing Asset
  const missingAsset = resolver.resolve({
    assetId: 'test-missing',
    provider: 'tmdb',
    path: null,
    mediaType: 'poster',
  });
  if (missingAsset.availability !== 'missing' || !missingAsset.isFallback) {
    throw new Error(
      `Resolver failed to provide deterministic fallback for missing asset: ${JSON.stringify(missingAsset)}`
    );
  }
  console.log(` -> Deterministic Fallback URL: ${missingAsset.resolvedUrl}`);

  // 2. Movie Media Bundles
  console.log('\n[MOVIES] Verifying media bundles for all canonical movies...');
  const movies = repository.movies.getMovies();
  for (const movie of movies) {
    const bundle = repository.media.getMovieMedia(movie.canonicalId, {
      posterSize: 'medium',
      backdropSize: 'large',
    });

    if (!bundle) {
      throw new Error(
        `Failed to resolve media bundle for movie: ${movie.canonicalId}`
      );
    }

    const posterStatus = bundle.primaryPoster?.availability ?? 'none';
    const backdropStatus = bundle.primaryBackdrop?.availability ?? 'none';
    console.log(
      ` -> [${movie.canonicalId}] "${movie.title}": poster=${posterStatus} (${bundle.primaryPoster?.resolvedUrl}), backdrop=${backdropStatus}`
    );
  }

  // 3. TV Series Media Bundles
  console.log(
    '\n[TV SERIES] Verifying media bundles for all canonical TV series...'
  );
  const tvSeries = repository.tv.getSeries();
  for (const series of tvSeries) {
    const bundle = repository.media.getSeriesMedia(series.canonicalId);
    if (!bundle) {
      throw new Error(
        `Failed to resolve media bundle for series: ${series.canonicalId}`
      );
    }
    console.log(
      ` -> [${series.canonicalId}] "${series.title}": poster=${bundle.primaryPoster?.availability}, backdrop=${bundle.primaryBackdrop?.availability}`
    );
  }

  // 4. Character Media Bundles
  console.log(
    '\n[CHARACTERS] Verifying media bundles for all canonical characters...'
  );
  const characters = repository.characters.getCharacters();
  for (const character of characters) {
    const bundle = repository.media.getCharacterMedia(character.canonicalId);
    if (!bundle) {
      throw new Error(
        `Failed to resolve media bundle for character: ${character.canonicalId}`
      );
    }
    console.log(
      ` -> [${character.canonicalId}] ${character.name}: avatar=${bundle.primaryAvatar?.availability} (${bundle.primaryAvatar?.resolvedUrl})`
    );
  }

  // 5. Full Repository Media Integrity Audit
  console.log(
    '\n[AUDIT] Running full media integrity audit across repository...'
  );
  const audit = repository.media.validateMediaIntegrity();
  console.log(` -> Total Assets Checked: ${audit.totalChecked}`);
  console.log(` -> Available Assets:     ${audit.availableCount}`);
  console.log(` -> Missing Assets:       ${audit.missingCount}`);
  console.log(` -> Unavailable / Error:  ${audit.unavailableCount}`);

  if (!audit.isValid || audit.errors.length > 0) {
    console.error('Media integrity audit reported errors:');
    audit.errors.forEach((e) => console.error(`  - ${e}`));
    throw new Error('Media integrity audit failed');
  }

  console.log(
    '\n[SUCCESS] Batch 3 media pipeline & asset infrastructure verification passed 100%!'
  );
}

const isDirectRun =
  process.argv[1]?.endsWith('media-verify.ts') ||
  process.argv[1]?.endsWith('media-verify.js');

if (isDirectRun) {
  runMediaVerification().catch((err) => {
    console.error('\n[FATAL ERROR]', err.message);
    process.exit(1);
  });
}
