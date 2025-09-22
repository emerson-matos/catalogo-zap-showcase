import type { ReactNode } from 'react';

export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  readonly size?: 'default' | 'sm' | 'lg' | 'icon';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  readonly type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly error?: string;
  readonly onChange?: (value: string) => void;
  readonly onBlur?: () => void;
  readonly onFocus?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly closeOnOverlayClick?: boolean;
  readonly closeOnEscape?: boolean;
}

export interface ToastProps {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly type?: 'success' | 'error' | 'warning' | 'info';
  readonly duration?: number;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
}

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: ReactNode;
  readonly isActive?: boolean;
  readonly isDisabled?: boolean;
}

export interface ThemeConfig {
  readonly theme: 'light' | 'dark' | 'system';
  readonly setTheme: (theme: 'light' | 'dark' | 'system') => void;
}