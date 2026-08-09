import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { useFieldContext } from '../Field/Field';

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  isInvalid?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id: customId,
      disabled: customDisabled,
      isInvalid: customIsInvalid,
      placeholder,
      className,
      children,
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
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'w-full px-3 py-2 pr-9 text-sm bg-surface text-content-primary rounded-md border border-stroke-subtle appearance-none cursor-pointer',
            'transition-shadow duration-150',
            'focus-visible:outline-none focus-visible:border-stroke-focus focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            'disabled:opacity-disabled disabled:cursor-not-allowed disabled:bg-surface-raised',
            isInvalid && 'border-statusError focus-visible:ring-statusError',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        {/* Custom Chevron Indicator */}
        <span className="absolute right-3 pointer-events-none text-content-secondary shrink-0 inline-flex items-center">
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';
