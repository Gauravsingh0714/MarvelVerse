import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
} from 'react';
import { cn } from '../../../utils/cn';
import { Portal } from '../infrastructure/Portal';
import { Overlay } from '../infrastructure/Overlay';
import { useFocusTrap } from '../infrastructure/useFocusTrap';
import { useScrollLock } from '../infrastructure/useScrollLock';
import { registerOverlay } from '../infrastructure/overlay-stack';

/* -------------------------------------------------------------------------- */
/*                            AlertDialog Context                             */
/* -------------------------------------------------------------------------- */

export interface AlertDialogContextValue {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (has: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (has: boolean) => void;
  cancelRef: React.RefObject<HTMLElement | null>;
}

const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(
  undefined
);

export const useAlertDialogContext = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      'AlertDialog subcomponents must be used within <AlertDialog>'
    );
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                            AlertDialog Root                                */
/* -------------------------------------------------------------------------- */

export interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialogRoot: React.FC<AlertDialogProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const cancelRef = useRef<HTMLElement | null>(null);
  const baseId = useId();
  const titleId = `alertdialog-title-${baseId}`;
  const descriptionId = `alertdialog-desc-${baseId}`;

  const openDialog = () => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  };

  const closeDialog = () => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  const contextValue: AlertDialogContextValue = {
    isOpen,
    openDialog,
    closeDialog,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle,
    hasDescription,
    setHasDescription,
    cancelRef,
  };

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {children}
    </AlertDialogContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                          AlertDialog Trigger                               */
/* -------------------------------------------------------------------------- */

export interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const AlertDialogTrigger = forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps
>(({ children, asChild = false, onClick, ...props }, ref) => {
  const { openDialog } = useAlertDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    openDialog();
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(e);
        openDialog();
      },
    });
  }

  return (
    <button ref={ref} type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
AlertDialogTrigger.displayName = 'AlertDialog.Trigger';

/* -------------------------------------------------------------------------- */
/*                          AlertDialog Content                               */
/* -------------------------------------------------------------------------- */

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnEscape?: boolean;
}

const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ closeOnEscape = false, className, children, ...props }, ref) => {
    const {
      isOpen,
      closeDialog,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      cancelRef,
    } = useAlertDialogContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentId = useId();

    useFocusTrap({
      active: isOpen,
      initialFocusRef: cancelRef,
      containerRef,
    });

    useScrollLock(isOpen);

    useEffect(() => {
      if (!isOpen) return;

      const unregister = registerOverlay({
        id: contentId,
        type: 'alertdialog',
        dismissible: closeOnEscape,
        onEscape: closeDialog,
        priority: 1300,
      });

      return () => unregister();
    }, [isOpen, closeOnEscape, closeDialog, contentId]);

    if (!isOpen) return null;

    return (
      <Portal>
        <Overlay visible={isOpen} blur={true} />
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={(node) => {
              containerRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
            }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            tabIndex={-1}
            className={cn(
              'relative w-full max-w-md bg-surface text-content-primary rounded-lg border border-stroke-subtle shadow-xl focus:outline-none flex flex-col',
              'transition-all duration-200 ease-cinematic',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </Portal>
    );
  }
);
AlertDialogContent.displayName = 'AlertDialog.Content';

/* -------------------------------------------------------------------------- */
/*                        AlertDialog Subcomponents                           */
/* -------------------------------------------------------------------------- */

export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-1.5 p-6 pb-4 border-b border-stroke-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
AlertDialogHeader.displayName = 'AlertDialog.Header';

export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { titleId, setHasTitle } = useAlertDialogContext();

    useEffect(() => {
      setHasTitle(true);
      return () => setHasTitle(false);
    }, [setHasTitle]);

    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn(
          'text-lg font-semibold text-content-primary tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
AlertDialogTitle.displayName = 'AlertDialog.Title';

export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ className, children, ...props }, ref) => {
  const { descriptionId, setHasDescription } = useAlertDialogContext();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn(
        'text-xs text-content-secondary leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});
AlertDialogDescription.displayName = 'AlertDialog.Description';

export interface AlertDialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogBody = forwardRef<HTMLDivElement, AlertDialogBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 py-4 flex-1', className)} {...props}>
      {children}
    </div>
  )
);
AlertDialogBody.displayName = 'AlertDialog.Body';

export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 p-6 pt-4 border-t border-stroke-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
AlertDialogFooter.displayName = 'AlertDialog.Footer';

export interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { closeDialog, cancelRef } = useAlertDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      closeDialog();
    };

    const handleRef = (node: HTMLButtonElement | null) => {
      (cancelRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          closeDialog();
        },
        ref: handleRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button ref={handleRef} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);
AlertDialogCancel.displayName = 'AlertDialog.Cancel';

export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { closeDialog } = useAlertDialogContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      closeDialog();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          closeDialog();
        },
      });
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);
AlertDialogAction.displayName = 'AlertDialog.Action';

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
});
