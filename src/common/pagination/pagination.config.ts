import { ListParams, Pagination, SortOrder } from './pagination.type';

export const normalizePaginationParams = (
  params: ListParams = {},
  defaults = { page: 1, limit: 20, sort: 'createdAt', order: SortOrder.DESC },
  maxLimit = 100,
): Pagination => {
  const page = Math.max(Number(params.page) || defaults.page, 1);
  const limit = Math.min(Math.max(Number(params.limit) || defaults.limit, 1), maxLimit);

  const sort = params.sort || defaults.sort;

  const order =
    params.order === SortOrder.ASC || params.order === SortOrder.DESC
      ? params.order
      : defaults.order;

  return { page, limit, sort, order };
};
