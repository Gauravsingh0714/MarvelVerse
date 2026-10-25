import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  formatYear,
  isLeapYear,
  isValidCalendarDate,
  DATE_UNAVAILABLE_FALLBACK,
} from '../src/utils/date.utils.js';

test('date.utils - leap year calculations', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(2000), true);
  assert.equal(isLeapYear(2020), true);
  assert.equal(isLeapYear(2023), false);
  assert.equal(isLeapYear(2021), false);
  assert.equal(isLeapYear(1900), false);
});

test('date.utils - calendar date validation', () => {
  assert.equal(isValidCalendarDate(2024, 2, 29), true);
  assert.equal(isValidCalendarDate(2023, 2, 29), false);
  assert.equal(isValidCalendarDate(2023, 2, 31), false);
  assert.equal(isValidCalendarDate(2024, 4, 31), false);
  assert.equal(isValidCalendarDate(2024, 4, 30), true);
  assert.equal(isValidCalendarDate(2024, 13, 1), false);
  assert.equal(isValidCalendarDate(2024, 0, 1), false);
  assert.equal(isValidCalendarDate(2024, 12, 31), true);
});

test('date.utils - formatDate handles valid full dates (DD-MM-YYYY)', () => {
  assert.equal(formatDate('2026-10-26'), '26-10-2026');
  assert.equal(formatDate('2008-05-02'), '02-05-2008');
  assert.equal(formatDate('2012-05-04'), '04-05-2012');
  assert.equal(formatDate('2019-04-26'), '26-04-2019');
  assert.equal(formatDate('2021-06-09'), '09-06-2021'); // Loki S1 Premiere
  assert.equal(formatDate('2015-04-10'), '10-04-2015'); // Daredevil S1 Premiere
});

test('date.utils - formatDate handles leap year dates accurately', () => {
  assert.equal(formatDate('2024-02-29'), '29-02-2024');
  assert.equal(formatDate('2000-02-29'), '29-02-2000');
  assert.equal(formatDate('2023-02-29'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('1900-02-29'), DATE_UNAVAILABLE_FALLBACK);
});

test('date.utils - formatDate rejects impossible calendar dates', () => {
  assert.equal(formatDate('2023-02-31'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2024-13-01'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2024-04-31'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2024-06-31'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2024-00-10'), DATE_UNAVAILABLE_FALLBACK);
});

test('date.utils - formatDate preserves partial month and year precision', () => {
  assert.equal(formatDate('2026-10'), '10-2026');
  assert.equal(formatDate('1999-05'), '05-1999');
  assert.equal(formatDate('2026-13'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2026'), '2026');
  assert.equal(formatDate('1984'), '1984');
  assert.equal(formatDate('999'), DATE_UNAVAILABLE_FALLBACK);
});

test('date.utils - formatDate safely handles missing, null, undefined, and empty inputs', () => {
  assert.equal(formatDate(null), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate(undefined), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate(''), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('   '), DATE_UNAVAILABLE_FALLBACK);
});

test('date.utils - formatDate safely handles malformed inputs without returning invalid strings unchanged', () => {
  assert.equal(formatDate('not-a-date'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('2024/05/10'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('10-05-2024'), DATE_UNAVAILABLE_FALLBACK);
  assert.equal(formatDate('random-string-value'), DATE_UNAVAILABLE_FALLBACK);
});

test('date.utils - formatDate avoids timezone-induced date shifts', () => {
  // ISO datetime string should extract 2026-10-26 directly without timezone shift
  assert.equal(formatDate('2026-10-26T00:00:00.000Z'), '26-10-2026');
  assert.equal(formatDate('2021-06-09T23:59:59.999Z'), '09-06-2021');
});

test('date.utils - formatYear extracts 4-digit release year correctly', () => {
  assert.equal(formatYear('2008-05-02'), '2008');
  assert.equal(formatYear('2021-06-09'), '2021');
  assert.equal(formatYear('2026-10'), '2026');
  assert.equal(formatYear('2026'), '2026');
  assert.equal(formatYear(null), '');
  assert.equal(formatYear(undefined), '');
  assert.equal(formatYear(''), '');
  assert.equal(formatYear('invalid'), '');
});
