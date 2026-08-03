import { z } from 'zod';
import { uuidSchema } from './uuid.schema.js';

export const idParamsSchema = z.object({
  id: uuidSchema,
});
