export type Pagination = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};

export type PageParams = {
  page?: number;
  limit?: number;
};

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortParams = {
  sort?: string;
  order?: SortOrder;
};

export type ListParams = PageParams & SortParams;

export type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
