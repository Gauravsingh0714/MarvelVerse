import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { useFieldContext } from '../Field/Field';

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isInvalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      disabled: customDisabled,
      isInvalid: customIsInvalid,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    const context = useFieldContext();

    const id = customId || context?.id;
    const disabled = customDisabled ?? context?.disabled ?? false;
    const isInvalid = customIsInvalid ?? context?.isInvalid ?? false;

    const ariaDescribedBy =
      [
        context?.hasHelperText && context?.helperTextId,
        isInvalid && context?.hasErrorMessage && context?.errorMessageId,
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-content-secondary pointer-events-none shrink-0 inline-flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'w-full px-3 py-2 text-sm bg-surface text-content-primary rounded-md border border-stroke-subtle',
            'placeholder:text-content-muted transition-shadow duration-150',
            'focus-visible:outline-none focus-visible:border-stroke-focus focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            'disabled:opacity-disabled disabled:cursor-not-allowed disabled:bg-surface-raised',
            isInvalid && 'border-statusError focus-visible:ring-statusError',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-content-secondary pointer-events-none shrink-0 inline-flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
