import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      name,
      value = 'on',
      disabled = false,
      className,
      id: customId,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const generatedId = useId();
    const id = customId || `switch-${generatedId}`;

    const handleToggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onChange?.(next);
    };

    return (
      <div
        className={cn(
          'inline-flex items-center gap-2.5 select-none',
          disabled && 'opacity-disabled cursor-not-allowed pointer-events-none',
          className
        )}
      >
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            isChecked
              ? 'bg-vibraniumCyan'
              : 'bg-surface-raised border-stroke-subtle'
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition duration-150 ease-in-out',
              isChecked
                ? 'translate-x-5 bg-black'
                : 'translate-x-0 bg-content-secondary'
            )}
          />
        </button>

        {/* Hidden checkbox for native HTML form submission */}
        {name && (
          <input
            type="checkbox"
            name={name}
            value={value}
            checked={isChecked}
            onChange={() => {}}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only"
          />
        )}

        {label && (
          <label
            htmlFor={id}
            onClick={handleToggle}
            className="text-sm font-medium text-content-primary cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
