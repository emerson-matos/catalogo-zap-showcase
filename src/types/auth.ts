import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AuthState {
  readonly user: User | null;
  readonly session: Session | null;
  readonly role: UserRole | null;
  readonly isLoading: boolean;
  readonly isAdmin: boolean;
  readonly isEditor: boolean;
  readonly isViewer: boolean;
}

export interface JWTPayload {
  readonly user_role: UserRole;
  readonly sub: string;
  readonly email: string;
  readonly exp: number;
  readonly iat: number;
}