/**
 * Date Formatting & Validation Utility
 *
 * Implements strict calendar date validation and presentation formatting (DD-MM-YYYY)
 * for the MarvelVerse frontend without mutating canonical ISO records or causing timezone shifts.
 */

export const DATE_UNAVAILABLE_FALLBACK = 'Date unavailable';

/**
 * Checks whether a given Gregorian year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the maximum days in a given month of a given year.
 * Returns 0 for out-of-range months.
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
}

/**
 * Validates actual calendar dates against real calendar constraints.
 * Rejects invalid dates such as 2023-02-31, 2023-02-29 (non-leap), or 2024-13-01.
 */
export function isValidCalendarDate(
  year: number,
  month: number,
  day: number
): boolean {
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1800 || year > 2200) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDays;
}

/**
 * Formats a valid ISO date string into user-facing presentation format:
 * - Full date (YYYY-MM-DD): formatted as DD-MM-YYYY (e.g. 2026-10-26 -> 26-10-2026)
 * - Partial year-month (YYYY-MM): formatted as MM-YYYY (e.g. 2026-10 -> 10-2026)
 * - Partial year (YYYY): formatted as YYYY (e.g. 2026 -> 2026)
 *
 * Strictly validates calendar dates. Malformed, out-of-bounds, or invalid calendar dates
 * return the consistent fallback 'Date unavailable'.
 * Uses purely string/numeric operations to avoid timezone shift artifacts.
 */
export function formatDate(isoDate?: string | null): string {
  if (!isoDate || typeof isoDate !== 'string') {
    return DATE_UNAVAILABLE_FALLBACK;
  }

  const trimmed = isoDate.trim();
  if (!trimmed) {
    return DATE_UNAVAILABLE_FALLBACK;
  }

  // Full date check: YYYY-MM-DD (optionally followed by T time component)
  const fullMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);
  if (fullMatch) {
    const year = Number(fullMatch[1]);
    const month = Number(fullMatch[2]);
    const day = Number(fullMatch[3]);

    if (!isValidCalendarDate(year, month, day)) {
      return DATE_UNAVAILABLE_FALLBACK;
    }

    return `${fullMatch[3]}-${fullMatch[2]}-${fullMatch[1]}`;
  }

  // Partial year-month check: YYYY-MM
  const ymMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (ymMatch) {
    const year = Number(ymMatch[1]);
    const month = Number(ymMatch[2]);

    if (year < 1800 || year > 2200 || month < 1 || month > 12) {
      return DATE_UNAVAILABLE_FALLBACK;
    }

    return `${ymMatch[2]}-${ymMatch[1]}`;
  }

  // Partial year check: YYYY
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    const year = Number(yearMatch[1]);
    if (year < 1800 || year > 2200) {
      return DATE_UNAVAILABLE_FALLBACK;
    }
    return yearMatch[1];
  }

  // Malformed or unrecognized format
  return DATE_UNAVAILABLE_FALLBACK;
}

/**
 * Extracts the 4-digit year safely from a valid date string.
 * Returns empty string for invalid, missing, or malformed input.
 */
export function formatYear(isoDate?: string | null): string {
  if (!isoDate || typeof isoDate !== 'string') {
    return '';
  }

  const trimmed = isoDate.trim();
  const match = trimmed.match(/^(\d{4})/);
  if (!match) return '';

  const year = Number(match[1]);
  if (year < 1800 || year > 2200) return '';

  return match[1];
}
