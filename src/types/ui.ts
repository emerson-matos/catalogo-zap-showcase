import type { ReactNode } from 'react';

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: ReactNode;
  readonly isActive?: boolean;
  readonly isDisabled?: boolean;
}