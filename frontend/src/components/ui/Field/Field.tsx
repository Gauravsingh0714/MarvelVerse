import React, {
  forwardRef,
  createContext,
  useContext,
  useId,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '../../../utils/cn';

export interface FieldContextValue {
  id: string;
  helperTextId?: string;
  errorMessageId?: string;
  isInvalid: boolean;
  disabled?: boolean;
  required?: boolean;
  hasHelperText: boolean;
  hasErrorMessage: boolean;
  registerHelperText: () => () => void;
  registerErrorMessage: () => () => void;
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined);

export const useFieldContext = () => useContext(FieldContext);

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  isInvalid?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      id: customId,
      isInvalid = false,
      disabled = false,
      required = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = customId || `field-${generatedId}`;
    const helperTextId = `${fieldId}-helper`;
    const errorMessageId = `${fieldId}-error`;

    const [hasHelperText, setHasHelperText] = useState(false);
    const [hasErrorMessage, setHasErrorMessage] = useState(false);

    const registerHelperText = useCallback(() => {
      setHasHelperText(true);
      return () => setHasHelperText(false);
    }, []);

    const registerErrorMessage = useCallback(() => {
      setHasErrorMessage(true);
      return () => setHasErrorMessage(false);
    }, []);

    const contextValue: FieldContextValue = {
      id: fieldId,
      helperTextId,
      errorMessageId,
      isInvalid,
      disabled,
      required,
      hasHelperText,
      hasErrorMessage,
      registerHelperText,
      registerErrorMessage,
    };

    return (
      <FieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex flex-col gap-1.5 w-full', className)}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);
FieldComponent.displayName = 'Field';

/* -------------------------------------------------------------------------- */
/*                               Field Subcomponents                          */
/* -------------------------------------------------------------------------- */

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, ...props }, ref) => {
    const context = useFieldContext();

    return (
      <label
        ref={ref}
        htmlFor={context?.id}
        className={cn(
          'text-xs font-medium text-content-primary select-none flex items-center gap-1',
          context?.disabled && 'opacity-disabled cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
        {context?.required && (
          <span className="text-starkRed font-semibold" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);
FieldLabel.displayName = 'Field.Label';

export interface FieldControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FieldControl = forwardRef<HTMLDivElement, FieldControlProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        {children}
      </div>
    );
  }
);
FieldControl.displayName = 'Field.Control';

export interface FieldHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldHelperText = forwardRef<HTMLParagraphElement, FieldHelperTextProps>(
  ({ className, children, ...props }, ref) => {
    const context = useFieldContext();

    useEffect(() => {
      if (context?.registerHelperText) {
        const unregister = context.registerHelperText();
        return () => unregister();
      }
      return undefined;
    }, [context?.registerHelperText]);

    return (
      <p
        ref={ref}
        id={context?.helperTextId}
        className={cn('text-xs text-content-secondary', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldHelperText.displayName = 'Field.HelperText';

export interface FieldErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FieldErrorMessage = forwardRef<
  HTMLParagraphElement,
  FieldErrorMessageProps
>(({ className, children, ...props }, ref) => {
  const context = useFieldContext();

  const isVisible = Boolean(context?.isInvalid || children);

  useEffect(() => {
    if (isVisible && context?.registerErrorMessage) {
      const unregister = context.registerErrorMessage();
      return () => unregister();
    }
    return undefined;
  }, [isVisible, context?.registerErrorMessage]);

  if (!isVisible) return null;

  return (
    <p
      ref={ref}
      id={context?.errorMessageId}
      role="alert"
      className={cn('text-xs font-medium text-statusError', className)}
      {...props}
    >
      {children}
    </p>
  );
});
FieldErrorMessage.displayName = 'Field.ErrorMessage';

export const Field = Object.assign(FieldComponent, {
  Label: FieldLabel,
  Control: FieldControl,
  HelperText: FieldHelperText,
  ErrorMessage: FieldErrorMessage,
});
