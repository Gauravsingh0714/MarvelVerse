import { z } from 'zod';
import { SortOrder } from '../../enums/sort-order.enum.js';

export const sortingQuerySchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.nativeEnum(SortOrder).default(SortOrder.ASC),
});
