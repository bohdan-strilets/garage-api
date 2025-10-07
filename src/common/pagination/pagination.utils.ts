import { PaginationMeta, SortOrder } from './pagination.type';

export const getSkip = (page: number = 1, limit: number = 10): number => {
  return (page - 1) * limit;
};

export const getSortBy = (sort: string, order: SortOrder): Record<string, 1 | -1> => {
  const direction = order === SortOrder.ASC ? 1 : -1;
  return { [sort]: direction, _id: direction };
};

export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    totalItems,
    totalPages,
    currentPage: safePage,
    itemsPerPage: limit,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
};
