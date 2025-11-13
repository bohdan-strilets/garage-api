import type { FilterQuery, Model } from 'mongoose';

import { PageMeta, PaginatedResult, PaginationOptions } from './pagination.types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const normalizePagination = (options?: PaginationOptions) => {
  const page = Math.max(1, Math.trunc(options?.page ?? DEFAULT_PAGE));
  const limitRaw = Math.trunc(options?.limit ?? DEFAULT_LIMIT);
  const limit = limitRaw < 0 ? 0 : limitRaw;
  const sort = options?.sort ?? { _id: -1 };
  const lean = options?.lean !== false;
  const skip = limit === 0 ? 0 : (page - 1) * limit;

  return { page, limit, sort, skip, lean };
};

export const buildMeta = (total: number, page: number, limit: number): PageMeta => {
  if (limit === 0) {
    return {
      page,
      limit,
      total,
      pages: total > 0 ? 1 : 0,
      hasPrev: false,
      hasNext: false,
      prevPage: null,
      nextPage: null,
    };
  }

  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const hasPrev = safePage > 1;
  const hasNext = safePage < pages;
  return {
    page: safePage,
    limit,
    total,
    pages,
    hasPrev,
    hasNext,
    prevPage: hasPrev ? safePage - 1 : null,
    nextPage: hasNext ? safePage + 1 : null,
  };
};

export const paginateFind = async <T>(
  model: Model<T>,
  filter: FilterQuery<T>,
  options?: PaginationOptions,
): Promise<PaginatedResult<T>> => {
  const { page, limit, sort, lean, skip } = normalizePagination(options);

  const [items, total] = await Promise.all([
    (lean
      ? model.find(filter).sort(sort).skip(skip).limit(limit).lean()
      : model.find(filter).sort(sort).skip(skip).limit(limit)
    ).exec() as unknown as Promise<T[]>,
    model.countDocuments(filter).exec(),
  ]);

  return { items, meta: buildMeta(total, page, limit) };
};
