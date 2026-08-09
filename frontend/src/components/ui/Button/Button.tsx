import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'vibranium';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export type ButtonProps<C extends React.ElementType = 'button'> =
  PolymorphicComponentPropsWithRef<C, ButtonOwnProps>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-starkRed text-white hover:bg-starkRed/90 active:scale-[0.98] focus-visible:ring-starkRed',
  secondary:
    'bg-surface-raised text-content-primary hover:bg-surface-glass border border-stroke-subtle active:scale-[0.98] focus-visible:ring-stroke-focus',
  outline:
    'bg-transparent text-content-primary border border-stroke hover:bg-surface-raised active:scale-[0.98] focus-visible:ring-stroke-focus',
  ghost:
    'bg-transparent text-content-primary hover:bg-surface-raised active:scale-[0.98] focus-visible:ring-stroke-focus',
  destructive:
    'bg-statusError text-white hover:bg-statusError/90 active:scale-[0.98] focus-visible:ring-statusError',
  vibranium:
    'bg-vibraniumCyan text-black font-semibold hover:bg-vibraniumCyan/90 active:scale-[0.98] focus-visible:ring-vibraniumCyan shadow-glow-cyan',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 min-h-[32px] gap-1.5 rounded-sm',
  md: 'text-sm px-4 py-2 min-h-[40px] gap-2 rounded-md',
  lg: 'text-base px-6 py-2.5 min-h-[48px] gap-2.5 rounded-lg',
};

export const Button = forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      className,
      children,
      ...props
    }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const isDisabled = disabled || isLoading;

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:opacity-disabled disabled:pointer-events-none disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex shrink-0">{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className="inline-flex shrink-0">{rightIcon}</span>
            )}
          </>
        )}
      </Component>
    );
  }
) as <C extends React.ElementType = 'button'>(
  props: ButtonProps<C>
) => React.ReactElement | null;

(Button as React.FC).displayName = 'Button';

/* -------------------------------------------------------------------------- */
/*                                 IconButton                                 */
/* -------------------------------------------------------------------------- */

export interface IconButtonProps extends Omit<
  ButtonOwnProps,
  'fullWidth' | 'leftIcon' | 'rightIcon'
> {
  'aria-label': string;
  icon: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  disabled?: boolean;
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'p-1.5 min-h-[32px] min-w-[32px] rounded-sm',
  md: 'p-2 min-h-[40px] min-w-[40px] rounded-md',
  lg: 'p-2.5 min-h-[48px] min-w-[48px] rounded-lg',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      'aria-label': ariaLabel,
      icon,
      variant = 'ghost',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={ariaLabel}
        className={cn(iconSizeClasses[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
