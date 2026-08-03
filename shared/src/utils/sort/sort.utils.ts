import { SortOrder } from '../../enums/sort-order.enum.js';

export const parseSort = (
  sortStr?: string,
  defaultSortBy = 'createdAt',
  defaultOrder = SortOrder.DESC
): { sortBy: string; sortOrder: SortOrder } => {
  if (!sortStr) {
    return { sortBy: defaultSortBy, sortOrder: defaultOrder };
  }
  const isDesc = sortStr.startsWith('-');
  const sortBy = isDesc ? sortStr.slice(1) : sortStr;
  const sortOrder = isDesc ? SortOrder.DESC : SortOrder.ASC;
  return { sortBy: sortBy || defaultSortBy, sortOrder };
};

export const isSortOrder = (val: unknown): val is SortOrder =>
  Object.values(SortOrder).includes(val as SortOrder);
