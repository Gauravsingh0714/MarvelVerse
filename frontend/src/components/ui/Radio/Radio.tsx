import React, { forwardRef, createContext, useContext, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined
);

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const RadioGroupComponent = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name: customName,
      value,
      disabled = false,
      onChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedName = useId();
    const name = customName || `radio-group-${generatedName}`;

    return (
      <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn('flex flex-col gap-2', className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroupComponent.displayName = 'RadioGroup';

/* -------------------------------------------------------------------------- */
/*                                Radio Item                                  */
/* -------------------------------------------------------------------------- */

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: React.ReactNode;
  value: string;
}

const RadioItem = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      value,
      disabled: customDisabled,
      className,
      id: customId,
      ...props
    },
    ref
  ) => {
    const groupContext = useContext(RadioGroupContext);
    const id = customId || useId();

    const name = groupContext?.name || props.name;
    const disabled = customDisabled ?? groupContext?.disabled ?? false;
    const isChecked = groupContext
      ? groupContext.value === value
      : props.checked;
    const onChange = groupContext ? groupContext.onChange : props.onChange;

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
            ref={ref}
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full border border-stroke-subtle bg-surface transition-colors duration-150 flex items-center justify-center',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-stroke-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas',
              'peer-checked:border-starkRed'
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full bg-starkRed opacity-0 transition-opacity duration-150',
                isChecked && 'opacity-100'
              )}
            />
          </div>
        </div>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
RadioItem.displayName = 'Radio';

export const Radio = Object.assign(RadioItem, {
  Group: RadioGroupComponent,
});
