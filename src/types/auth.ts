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

export interface AuthContextType extends AuthState {
  readonly signIn: (email: string, password: string) => Promise<void>;
  readonly signUp: (email: string, password: string) => Promise<void>;
  readonly signOut: () => Promise<void>;
  readonly resetPassword: (email: string) => Promise<void>;
}

export interface JWTPayload {
  readonly user_role: UserRole;
  readonly sub: string;
  readonly email: string;
  readonly exp: number;
  readonly iat: number;
}

export interface LoginFormData {
  readonly email: string;
  readonly password: string;
}

export interface SignupFormData {
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface ResetPasswordFormData {
  readonly email: string;
}