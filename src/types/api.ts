export interface ApiResponse<T> {
  readonly data: T;
  readonly error: null;
}

export interface ApiError {
  readonly data: null;
  readonly error: {
    readonly message: string;
    readonly code?: string;
    readonly details?: unknown;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

export interface QueryParams {
  readonly search?: string;
  readonly category?: string;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
  readonly page?: number;
  readonly limit?: number;
}

export interface LoadingState {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

export interface AsyncState<T> extends LoadingState {
  readonly data: T | null;
}