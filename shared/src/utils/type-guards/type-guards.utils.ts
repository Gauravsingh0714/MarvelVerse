import { UUID_REGEX } from '../../constants/regex.constants.js';
import { UUID, ISODateString } from '../../types/common/primitives.js';

export const isUUID = (val: unknown): val is UUID =>
  typeof val === 'string' && UUID_REGEX.test(val);

export const isISODate = (val: unknown): val is ISODateString => {
  if (typeof val !== 'string') return false;
  const d = new Date(val);
  return !isNaN(d.getTime()) && val.includes('T');
};

export const isDefined = <T>(val: T | undefined | null): val is T =>
  val !== undefined && val !== null;

export const isNullOrUndefined = (val: unknown): val is null | undefined =>
  val === null || val === undefined;
