import { z } from 'zod';
import { UUID_REGEX } from '../../constants/regex.constants.js';

export const uuidSchema = z.string().regex(UUID_REGEX, {
  message: 'Invalid UUID format',
});
