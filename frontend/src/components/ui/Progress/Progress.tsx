import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'vibranium' | 'destructive';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  indeterminate?: boolean;
  className?: string;
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses: Record<ProgressVariant, string> = {
  primary: 'bg-starkRed',
  vibranium: 'bg-vibraniumCyan',
  destructive: 'bg-statusError',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'md',
      variant = 'vibranium',
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = indeterminate || value === undefined;

    // Clamp determinate value between 0 and max
    const clampedValue =
      value !== undefined ? Math.min(Math.max(value, 0), max) : 0;
    const percentage = (clampedValue / max) * 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        className={cn(
          'w-full bg-surface-raised rounded-full overflow-hidden shrink-0 relative',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-cinematic',
            variantClasses[variant],
            isIndeterminate && 'w-full animate-pulse'
          )}
          style={{ width: isIndeterminate ? '100%' : `${percentage}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
