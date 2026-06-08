export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
};
