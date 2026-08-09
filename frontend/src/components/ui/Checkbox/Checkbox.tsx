import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: React.ReactNode;
  indeterminate?: boolean;
  isInvalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      isInvalid = false,
      disabled = false,
      className,
      id: customId,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const combinedRef =
      (ref as React.RefObject<HTMLInputElement>) || internalRef;

    useEffect(() => {
      if (combinedRef.current) {
        combinedRef.current.indeterminate = indeterminate;
      }
    }, [combinedRef, indeterminate]);

    const id = customId || React.useId();

    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-2.5 select-none cursor-pointer text-sm font-medium text-content-primary',
          disabled && 'opacity-disabled cursor-not-allowed pointer-events-none',
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={combinedRef}
            id={id}
            type="checkbox"
            disabled={disabled}
            aria-invalid={isInvalid}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border border-stroke-subtle bg-surface transition-colors duration-150',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-stroke-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas',
              'peer-checked:bg-starkRed peer-checked:border-starkRed peer-checked:text-white',
              indeterminate && 'bg-starkRed border-starkRed text-white',
              isInvalid && 'border-statusError'
            )}
          >
            {indeterminate ? (
              <svg
                className="w-full h-full p-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 12H4"
                />
              </svg>
            ) : (
              <svg
                className="w-full h-full p-0.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
