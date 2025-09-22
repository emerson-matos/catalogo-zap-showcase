export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface BaseEntity {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface TimestampedEntity extends BaseEntity {
  readonly created_by: string;
  readonly updated_by?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncOperation<T> {
  readonly status: Status;
  readonly data: T | null;
  readonly error: Error | null;
}

export type SortOrder = 'asc' | 'desc';

export interface SortConfig<T> {
  readonly field: keyof T;
  readonly order: SortOrder;
}

export interface FilterConfig<T> {
  readonly field: keyof T;
  readonly operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  readonly value: unknown;
}

export interface SearchConfig {
  readonly query: string;
  readonly fields: readonly string[];
  readonly caseSensitive?: boolean;
}