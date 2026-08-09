import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../../utils/cn';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'content'
> {
  content: React.ReactNode;
  position?: TooltipPosition;
  delayMs?: number;
  className?: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { content, position = 'top', delayMs = 200, className, children, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<ReturnType<
      typeof setTimeout
    > | null>(null);

    const generatedId = useId();
    const tooltipId = `tooltip-${generatedId}`;

    const showTooltip = () => {
      const id = setTimeout(() => setIsVisible(true), delayMs);
      setTimeoutId(id);
    };

    const hideTooltip = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setTimeoutId(null);
      setIsVisible(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideTooltip();
      }
    };

    const childProps = children.props as React.HTMLAttributes<HTMLElement>;
    const existingDescribedBy = childProps['aria-describedby'] || '';
    const describedByParts = existingDescribedBy.split(/\s+/).filter(Boolean);

    if (isVisible && !describedByParts.includes(tooltipId)) {
      describedByParts.push(tooltipId);
    }

    const combinedDescribedBy = describedByParts.join(' ') || undefined;

    const trigger = React.cloneElement(children, {
      'aria-describedby': combinedDescribedBy,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        childProps.onMouseEnter?.(e);
        showTooltip();
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        childProps.onMouseLeave?.(e);
        hideTooltip();
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        childProps.onFocus?.(e);
        showTooltip();
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        childProps.onBlur?.(e);
        hideTooltip();
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        childProps.onKeyDown?.(e);
        handleKeyDown(e);
      },
    } as React.HTMLAttributes<HTMLElement>);

    return (
      <div ref={ref} className="relative inline-block" {...props}>
        {trigger}
        {isVisible && (
          <div
            id={tooltipId}
            role="tooltip"
            className={cn(
              'absolute z-tooltip px-2.5 py-1 text-xs font-medium text-content-primary bg-surface-raised rounded border border-stroke-subtle shadow-md pointer-events-none whitespace-nowrap transition-opacity duration-150',
              positionClasses[position],
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
