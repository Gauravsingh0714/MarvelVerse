import {
  MovieCandidate,
  TvCandidate,
  CreditsCandidate,
  SeasonCandidate,
  NormalizedCandidate,
  movieCandidateSchema,
  tvCandidateSchema,
  creditsCandidateSchema,
  seasonCandidateSchema,
} from '@marvelverse/shared';

export interface ValidationReport {
  isValid: boolean;
  candidateId: string;
  recordType: 'movie' | 'tv' | 'credits' | 'season';
  errors: string[];
}

export class TmdbValidator {
  public validateMovie(candidate: MovieCandidate): ValidationReport {
    const parseResult = movieCandidateSchema.safeParse(candidate);
    const errors: string[] = [];

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join('.')}: ${issue.message}`);
      });
    }

    return {
      isValid: errors.length === 0,
      candidateId: candidate.candidateId,
      recordType: 'movie',
      errors,
    };
  }

  public validateTvSeries(candidate: TvCandidate): ValidationReport {
    const parseResult = tvCandidateSchema.safeParse(candidate);
    const errors: string[] = [];

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join('.')}: ${issue.message}`);
      });
    }

    return {
      isValid: errors.length === 0,
      candidateId: candidate.candidateId,
      recordType: 'tv',
      errors,
    };
  }

  public validateCredits(candidate: CreditsCandidate): ValidationReport {
    const parseResult = creditsCandidateSchema.safeParse(candidate);
    const errors: string[] = [];

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join('.')}: ${issue.message}`);
      });
    }

    return {
      isValid: errors.length === 0,
      candidateId: candidate.candidateId,
      recordType: 'credits',
      errors,
    };
  }

  public validateSeason(candidate: SeasonCandidate): ValidationReport {
    const parseResult = seasonCandidateSchema.safeParse(candidate);
    const errors: string[] = [];

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join('.')}: ${issue.message}`);
      });
    }

    return {
      isValid: errors.length === 0,
      candidateId: candidate.candidateId,
      recordType: 'season',
      errors,
    };
  }

  public validateCandidate(candidate: NormalizedCandidate): ValidationReport {
    if ('releaseDate' in candidate) {
      return this.validateMovie(candidate);
    }
    if ('numberOfSeasons' in candidate) {
      return this.validateTvSeries(candidate);
    }
    if ('mediaType' in candidate) {
      return this.validateCredits(candidate);
    }
    if ('tvSourceId' in candidate) {
      return this.validateSeason(candidate);
    }

    return {
      isValid: false,
      candidateId: (candidate as NormalizedCandidate).candidateId || 'unknown',
      recordType: 'movie',
      errors: ['Unrecognized candidate structure'],
    };
  }
}
