export type SortDir = 1 | -1;
export type Sort = Record<string, SortDir>;

export type PaginationOptions = {
  page?: number;
  limit?: number;
  sort?: Sort;
  lean?: boolean;
};

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PageMeta;
};
