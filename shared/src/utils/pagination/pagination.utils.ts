import { Pagination } from '../../contracts/pagination.types.js';

export const calculateOffset = (page: number, pageSize: number): number =>
  (Math.max(1, page) - 1) * Math.max(1, pageSize);

export const calculateTotalPages = (
  totalItems: number,
  pageSize: number
): number => Math.ceil(Math.max(0, totalItems) / Math.max(1, pageSize));

export const buildPaginationMeta = (
  page: number,
  pageSize: number,
  totalItems: number
): Pagination => {
  const totalPages = calculateTotalPages(totalItems, pageSize);
  const currentPage = Math.max(1, page);
  return {
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
