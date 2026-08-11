import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface SecondaryNavItem {
  id: string;
  label: string;
  href?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface SecondaryNavProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  items: SecondaryNavItem[];
  activeId?: string;
  onSelect?: (item: SecondaryNavItem) => void;
}

export const SecondaryNav = forwardRef<HTMLElement, SecondaryNavProps>(
  ({ items, activeId, onSelect, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="Secondary navigation"
        className={cn(
          'flex items-center gap-1 border-b border-stroke-subtle overflow-x-auto no-scrollbar',
          className
        )}
        {...props}
      >
        {items.map((item) => {
          const isActive = activeId === item.id || activeId === item.href;

          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => !item.disabled && onSelect?.(item)}
              className={cn(
                'px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap border-b-2 -mb-px flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus',
                isActive
                  ? 'border-stroke-focus text-content-primary font-semibold'
                  : 'border-transparent text-content-secondary hover:text-content-primary hover:border-stroke-subtle',
                item.disabled &&
                  'opacity-disabled cursor-not-allowed hover:border-transparent hover:text-content-secondary'
              )}
            >
              <span>{item.label}</span>
              {item.badge && <span className="shrink-0">{item.badge}</span>}
            </button>
          );
        })}
      </nav>
    );
  }
);

SecondaryNav.displayName = 'SecondaryNav';
