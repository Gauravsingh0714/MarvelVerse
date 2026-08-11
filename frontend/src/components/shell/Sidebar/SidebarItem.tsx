import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { NavigationItem } from '../types/shell.types';
import { Tooltip } from '../../ui/Tooltip/Tooltip';

export interface SidebarItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onSelect'
> {
  item: NavigationItem;
  active?: boolean;
  collapsed?: boolean;
  onSelect?: (item: NavigationItem) => void;
}

export const SidebarItem = forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      item,
      active = false,
      collapsed = false,
      onSelect,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (item.disabled) return;
      onClick?.(e);
      onSelect?.(item);
    };

    const content = (
      <button
        ref={ref}
        type="button"
        disabled={item.disabled}
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          active
            ? 'bg-surface-raised text-content-primary font-semibold border-l-2 border-l-stroke-focus'
            : 'text-content-secondary hover:text-content-primary hover:bg-surface-raised/50',
          item.disabled &&
            'opacity-disabled cursor-not-allowed hover:bg-transparent hover:text-content-secondary',
          collapsed && 'justify-center px-2',
          className
        )}
        {...props}
      >
        {item.icon && (
          <span
            className={cn(
              'shrink-0 text-base inline-flex items-center justify-center',
              active ? 'text-content-accent' : 'text-content-secondary'
            )}
            aria-hidden="true"
          >
            {item.icon}
          </span>
        )}

        {!collapsed && (
          <span className="truncate flex-1 leading-normal">{item.label}</span>
        )}

        {!collapsed && item.badge && (
          <span className="shrink-0 leading-none">{item.badge}</span>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip content={item.label} position="right" delayMs={100}>
          {content}
        </Tooltip>
      );
    }

    return content;
  }
);

SidebarItem.displayName = 'SidebarItem';
