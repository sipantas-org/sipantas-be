export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: any;
  data: T;
  pagination?: PaginationInfo;
  timestamp: string;
}
