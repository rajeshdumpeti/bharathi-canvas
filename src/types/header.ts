// src/types/header.tsx

export interface NavLinkItem {
  to: string;
  label: string;
}

export interface HeaderUser {
  name?: string;
  email?: string;
}

export interface HeaderProps {
  onToggleSidebar?: () => void;
  showHamburger?: boolean;
  showTitle?: boolean;

  navLinks?: NavLinkItem[];
  user?: HeaderUser | null;
  onSignOut?: () => void;
  onOpenSearch?: () => void;
}
