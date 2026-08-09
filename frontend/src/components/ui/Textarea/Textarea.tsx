import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { useFieldContext } from '../Field/Field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isInvalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: customId,
      disabled: customDisabled,
      isInvalid: customIsInvalid,
      className,
      rows = 4,
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'w-full px-3 py-2 text-sm bg-surface text-content-primary rounded-md border border-stroke-subtle',
          'placeholder:text-content-muted transition-shadow duration-150 resize-y min-h-[80px]',
          'focus-visible:outline-none focus-visible:border-stroke-focus focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:opacity-disabled disabled:cursor-not-allowed disabled:bg-surface-raised',
          isInvalid && 'border-statusError focus-visible:ring-statusError',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
