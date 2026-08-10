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
/*                               Drawer Context                               */
/* -------------------------------------------------------------------------- */

export interface DrawerContextValue {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  setHasTitle: (has: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (has: boolean) => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer subcomponents must be used within <Drawer>');
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                               Drawer Root                                  */
/* -------------------------------------------------------------------------- */

export interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DrawerRoot: React.FC<DrawerProps> = ({
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
  const titleId = `drawer-title-${baseId}`;
  const descriptionId = `drawer-desc-${baseId}`;

  const openDrawer = () => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  };

  const closeDrawer = () => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  };

  const contextValue: DrawerContextValue = {
    isOpen,
    openDrawer,
    closeDrawer,
    titleId,
    descriptionId,
    hasTitle,
    setHasTitle,
    hasDescription,
    setHasDescription,
  };

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Drawer Trigger                                */
/* -------------------------------------------------------------------------- */

export interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { openDrawer } = useDrawerContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      openDrawer();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          openDrawer();
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
DrawerTrigger.displayName = 'Drawer.Trigger';

/* -------------------------------------------------------------------------- */
/*                               Drawer Content                               */
/* -------------------------------------------------------------------------- */

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom';

const sideClasses: Record<DrawerSide, string> = {
  right: 'top-0 right-0 h-full w-full max-w-md border-l',
  left: 'top-0 left-0 h-full w-full max-w-md border-r',
  top: 'top-0 left-0 right-0 w-full max-h-[80vh] border-b',
  bottom: 'bottom-0 left-0 right-0 w-full max-h-[80vh] border-t',
};

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: DrawerSide;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      side = 'right',
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
      closeDrawer,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
    } = useDrawerContext();
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
      onOutsideInteraction: closeDrawer,
    });

    useEffect(() => {
      if (!isOpen) return;

      const unregister = registerOverlay({
        id: contentId,
        type: 'drawer',
        dismissible: closeOnEscape,
        onEscape: closeDrawer,
        priority: 1200,
      });

      return () => unregister();
    }, [isOpen, closeOnEscape, closeDrawer, contentId]);

    if (!isOpen) return null;

    return (
      <Portal>
        <Overlay
          visible={isOpen}
          onClick={closeOnBackdropClick ? closeDrawer : undefined}
        />
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
            'fixed z-drawer bg-surface text-content-primary border-stroke-subtle shadow-xl focus:outline-none flex flex-col',
            'transition-transform duration-300 ease-cinematic',
            sideClasses[side],
            className
          )}
          {...props}
        >
          {showCloseButton && (
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close drawer"
              className="absolute right-4 top-4 text-content-secondary hover:text-content-primary transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus:outline-none z-10"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {children}
        </div>
      </Portal>
    );
  }
);
DrawerContent.displayName = 'Drawer.Content';

/* -------------------------------------------------------------------------- */
/*                            Drawer Subcomponents                            */
/* -------------------------------------------------------------------------- */

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
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
DrawerHeader.displayName = 'Drawer.Header';

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { titleId, setHasTitle } = useDrawerContext();

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
DrawerTitle.displayName = 'Drawer.Title';

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
>(({ className, children, ...props }, ref) => {
  const { descriptionId, setHasDescription } = useDrawerContext();

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
DrawerDescription.displayName = 'Drawer.Description';

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
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
DrawerBody.displayName = 'Drawer.Body';

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
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
DrawerFooter.displayName = 'Drawer.Footer';

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { closeDrawer } = useDrawerContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      closeDrawer();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          closeDrawer();
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
DrawerClose.displayName = 'Drawer.Close';

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
});
