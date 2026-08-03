import { z } from 'zod';
import { EMAIL_REGEX } from '../../constants/regex.constants.js';

export const emailSchema = z.string().regex(EMAIL_REGEX, {
  message: 'Invalid email address format',
});
