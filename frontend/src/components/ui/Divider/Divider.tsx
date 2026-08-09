import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  className?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'shrink-0 border-stroke-subtle',
          isHorizontal
            ? 'w-full border-t my-4'
            : 'h-full border-l mx-4 min-h-[1em]',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
