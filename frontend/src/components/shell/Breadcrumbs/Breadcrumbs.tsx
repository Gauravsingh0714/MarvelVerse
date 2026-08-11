import React, { forwardRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { BreadcrumbItemData } from '../types/shell.types';

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemData[];
  onItemClick?: (item: BreadcrumbItemData) => void;
  separator?: React.ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, onItemClick, separator, className, ...props }, ref) => {
    if (!items || items.length === 0) return null;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('flex items-center', className)}
        {...props}
      >
        <ol className="flex items-center gap-1.5 text-xs text-content-secondary">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.id} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span
                    className="text-content-muted shrink-0"
                    aria-hidden="true"
                  >
                    {separator || <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-content-primary truncate max-w-[200px]"
                  >
                    {item.label}
                  </span>
                ) : item.href || onItemClick ? (
                  <button
                    type="button"
                    onClick={() => onItemClick?.(item)}
                    className="hover:text-content-primary hover:underline transition-colors truncate max-w-[150px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stroke-focus rounded"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="truncate max-w-[150px]">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
