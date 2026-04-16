/**
 * Genel API response sarmalayıcıları.
 */

/** Tek bir veri dönen response */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** Sayfalanmış veri dönen response */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API hata response */
export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
