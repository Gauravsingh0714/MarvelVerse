import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'vibranium';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-surface-raised text-content-secondary border border-stroke-subtle',
  primary: 'bg-starkRed/15 text-starkRed border border-starkRed/30',
  success:
    'bg-statusSuccess/15 text-statusSuccess border border-statusSuccess/30',
  warning:
    'bg-statusWarning/15 text-statusWarning border border-statusWarning/30',
  error: 'bg-statusError/15 text-statusError border border-statusError/30',
  info: 'bg-statusInfo/15 text-statusInfo border border-statusInfo/30',
  vibranium:
    'bg-vibraniumCyan/15 text-vibraniumCyan border border-vibraniumCyan/30',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-content-secondary',
  primary: 'bg-starkRed',
  success: 'bg-statusSuccess',
  warning: 'bg-statusWarning',
  error: 'bg-statusError',
  info: 'bg-statusInfo',
  vibranium: 'bg-vibraniumCyan',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1 rounded-full font-medium',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-full font-medium',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center tracking-wide shrink-0',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              dotColorClasses[variant]
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
