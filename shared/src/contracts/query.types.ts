import { SortOrder } from '../enums/sort-order.enum.js';

export interface SortingQuery {
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface FilteringQuery {
  filter?: Record<string, string | number | boolean | Array<string | number>>;
}

export interface SearchQuery {
  q?: string;
}
