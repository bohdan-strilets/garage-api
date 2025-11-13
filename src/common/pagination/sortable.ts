import { Sort, SortDir } from './pagination.types';

export const SORT_FIELDS = ['_id', 'createdAt', 'updatedAt', 'lastUsedAt', 'expiresAt'] as const;

const toDir = (v: unknown): SortDir => (v === -1 || String(v).toLowerCase() === 'desc' ? -1 : 1);

export const sanitizeSort = (
  input?: Record<string, unknown>,
  fallback: Sort = { _id: -1 },
): Sort => {
  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const out: Sort = {};

  for (const key of Object.keys(input)) {
    if ((SORT_FIELDS as readonly string[]).includes(key)) {
      out[key] = toDir((input as any)[key]);
    }
  }

  return Object.keys(out).length ? out : fallback;
};
