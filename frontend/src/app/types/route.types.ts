import { ReactNode } from 'react';

export interface RouteHandleMeta {
  title?: string;
  breadcrumb?:
    string | ((params: Record<string, string | undefined>) => string);
  navigationKey?: string;
  requiresShell?: boolean;
  icon?: ReactNode;
}

export interface RouteMatchHandle {
  handle?: RouteHandleMeta;
}
