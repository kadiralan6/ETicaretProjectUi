/** Tek bir veri dönen response */
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/** Sayfalanmış veri dönen response */
export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API hata response */
export interface IApiError {
  success: false;
  message: string;
  StatusCode: number;
  errors?: Record<string, string[]>;
}
