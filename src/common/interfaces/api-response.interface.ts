export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  errors: T | null;
  data: T | null;
  timestamp: string;
  path?: string;
}
