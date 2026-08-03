import { z } from 'zod';
import {
  SEARCH_MIN_LENGTH,
  SEARCH_MAX_LENGTH,
} from '../../constants/validation.constants.js';

export const searchQuerySchema = z.object({
  q: z.string().min(SEARCH_MIN_LENGTH).max(SEARCH_MAX_LENGTH).optional(),
});
