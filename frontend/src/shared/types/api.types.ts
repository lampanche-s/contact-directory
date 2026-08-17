export type ApiError = {
  message: string;
  status?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
};
