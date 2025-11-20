import type { PaginatedResult } from '@app/common/pagination';

import { ApiSuccessResponse } from '../types';

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isApiSuccessResponse = (value: unknown): value is ApiSuccessResponse<unknown> => {
  if (!isObject(value)) {
    return false;
  }

  if (!('success' in value) || !('data' in value)) {
    return false;
  }

  const success = (value as Record<string, unknown>).success;

  return typeof success === 'boolean';
};

export const isPaginatedResult = <T = unknown>(value: unknown): value is PaginatedResult<T> => {
  if (!isObject(value)) {
    return false;
  }

  if (!('items' in value) || !('meta' in value)) {
    return false;
  }

  const items = value.items;
  const meta = value.meta;

  if (!Array.isArray(items)) {
    return false;
  }

  if (!isObject(meta)) {
    return false;
  }

  const pageMeta = meta as Record<string, unknown>;

  return (
    typeof pageMeta.page === 'number' &&
    typeof pageMeta.limit === 'number' &&
    typeof pageMeta.total === 'number' &&
    typeof pageMeta.pages === 'number'
  );
};
