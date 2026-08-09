import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-statusInfo/10 border-statusInfo/30 text-content-primary',
  success: 'bg-statusSuccess/10 border-statusSuccess/30 text-content-primary',
  warning: 'bg-statusWarning/10 border-statusWarning/30 text-content-primary',
  error: 'bg-statusError/10 border-statusError/30 text-content-primary',
};

const iconColorClasses: Record<AlertVariant, string> = {
  info: 'text-statusInfo',
  success: 'text-statusSuccess',
  warning: 'text-statusWarning',
  error: 'text-statusError',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = 'info', title, onDismiss, icon, className, children, ...props },
    ref
  ) => {
    // Differentiate ARIA roles: critical errors use 'alert', non-critical use 'status'
    const role = variant === 'error' ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={role}
        aria-live={variant === 'error' ? 'assertive' : 'polite'}
        className={cn(
          'relative w-full p-4 rounded-md border flex items-start gap-3 text-sm',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon && (
          <span className={cn('shrink-0 mt-0.5', iconColorClasses[variant])}>
            {icon}
          </span>
        )}
        <div className="flex-1 flex flex-col gap-1">
          {title && <h5 className="font-semibold leading-none">{title}</h5>}
          {children && (
            <div className="text-content-secondary leading-relaxed">
              {children}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="shrink-0 p-1 text-content-secondary hover:text-content-primary rounded hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
