import { SLUG_REGEX } from '../../constants/regex.constants.js';

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const isSlug = (text: string): boolean => SLUG_REGEX.test(text);

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

export const isNonEmptyString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().length > 0;
