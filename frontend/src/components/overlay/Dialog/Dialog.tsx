import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Portal } from '../infrastructure/Portal';
import { Overlay } from '../infrastructure/Overlay';
import { useFocusTrap } from '../infrastructure/useFocusTrap';
import { useScrollLock } from '../infrastructure/useScrollLock';
import { useOutsideInteraction } from '../infrastructure/useOutsideInteraction';
import { registerOverlay } from '../infrastructure/overlay-stack';

/* -------------------------------------------------------------------------- */
/*                               Dialog Context                               */
/* -------------------------------------------------------------------------- */

export interface DialogContextValue {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (has: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (has: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog subcomponents must be used within <Dialog>');
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                               Dialog Root                                  */
/* -------------------------------------------------------------------------- */

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogRoot: React.FC<DialogProps> = ({
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
  const baseId = useId();
  const titleId = `dialog-title-${baseId}`;
  const descriptionId = `dialog-desc-${baseId}`;

  const openDialog = () => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  };

  const closeDialog = () => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  const contextValue: DialogContextValue = {
    isOpen,
    openDialog,
    closeDialog,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle,
    hasDescription,
    setHasDescription,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Dialog Trigger                                */
/* -------------------------------------------------------------------------- */

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { openDialog } = useDialogContext();

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
  }
);
DialogTrigger.displayName = 'Dialog.Trigger';

/* -------------------------------------------------------------------------- */
/*                               Dialog Content                               */
/* -------------------------------------------------------------------------- */

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
};

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: DialogSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      size = 'md',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      initialFocusRef,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      isOpen,
      closeDialog,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
    } = useDialogContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentId = useId();

    useFocusTrap({
      active: isOpen,
      initialFocusRef,
      containerRef,
    });

    useScrollLock(isOpen);

    useOutsideInteraction({
      active: isOpen && closeOnBackdropClick,
      refs: [containerRef],
      onOutsideInteraction: closeDialog,
    });

    useEffect(() => {
      if (!isOpen) return;

      const unregister = registerOverlay({
        id: contentId,
        type: 'dialog',
        dismissible: closeOnEscape,
        onEscape: closeDialog,
        priority: 1300,
      });

      return () => unregister();
    }, [isOpen, closeOnEscape, closeDialog, contentId]);

    if (!isOpen) return null;

    return (
      <Portal>
        <Overlay
          visible={isOpen}
          onClick={closeOnBackdropClick ? closeDialog : undefined}
        />
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={(node) => {
              containerRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            tabIndex={-1}
            className={cn(
              'relative w-full bg-surface text-content-primary rounded-lg border border-stroke-subtle shadow-xl focus:outline-none flex flex-col',
              'transition-all duration-200 ease-cinematic',
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {showCloseButton && (
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close dialog"
                className="absolute right-4 top-4 text-content-secondary hover:text-content-primary transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus:outline-none"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {children}
          </div>
        </div>
      </Portal>
    );
  }
);
DialogContent.displayName = 'Dialog.Content';

/* -------------------------------------------------------------------------- */
/*                            Dialog Subcomponents                            */
/* -------------------------------------------------------------------------- */

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-1 p-6 pb-4 border-b border-stroke-subtle',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DialogHeader.displayName = 'Dialog.Header';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { titleId, setHasTitle } = useDialogContext();

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
DialogTitle.displayName = 'Dialog.Title';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, children, ...props }, ref) => {
  const { descriptionId, setHasDescription } = useDialogContext();

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
DialogDescription.displayName = 'Dialog.Description';

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 py-4 flex-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
);
DialogBody.displayName = 'Dialog.Body';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
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
DialogFooter.displayName = 'Dialog.Footer';

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { closeDialog } = useDialogContext();

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
DialogClose.displayName = 'Dialog.Close';

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
});
