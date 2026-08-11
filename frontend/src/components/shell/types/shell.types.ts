import React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  section?: string;
  external?: boolean;
}

export interface NavigationSection {
  id: string;
  title?: string;
  items: NavigationItem[];
}

export interface BreadcrumbItemData {
  id: string;
  label: string;
  href?: string;
}

export interface ShellState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
}

export interface ShellSidebarConfig {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  persist?: boolean;
}
