import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { cn } from '../../../utils/cn';
import { Portal } from '../infrastructure/Portal';
import { useOutsideInteraction } from '../infrastructure/useOutsideInteraction';
import { registerOverlay } from '../infrastructure/overlay-stack';
import {
  getOverlayPosition,
  OverlayPlacement,
  OverlayAlign,
} from '../infrastructure/positioning.utils';

/* -------------------------------------------------------------------------- */
/*                               Popover Context                              */
/* -------------------------------------------------------------------------- */

export interface PopoverContextValue {
  isOpen: boolean;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  popoverId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | undefined>(
  undefined
);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover subcomponents must be used within <Popover>');
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                               Popover Root                                 */
/* -------------------------------------------------------------------------- */

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopoverRoot: React.FC<PopoverProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const anchorRef = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const popoverId = `popover-${generatedId}`;

  const openPopover = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const closePopover = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const togglePopover = useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, closePopover, openPopover]);

  const contextValue: PopoverContextValue = {
    isOpen,
    openPopover,
    closePopover,
    togglePopover,
    popoverId,
    anchorRef,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Popover Trigger                               */
/* -------------------------------------------------------------------------- */

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { isOpen, togglePopover, popoverId, anchorRef } = usePopoverContext();

    const handleRef = (node: HTMLButtonElement | null) => {
      (anchorRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      togglePopover();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          togglePopover();
        },
        'aria-expanded': isOpen,
        'aria-controls': popoverId,
        ref: handleRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button
        ref={handleRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = 'Popover.Trigger';

/* -------------------------------------------------------------------------- */
/*                               Popover Content                              */
/* -------------------------------------------------------------------------- */

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: OverlayPlacement;
  align?: OverlayAlign;
  offset?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      placement = 'bottom',
      align = 'start',
      offset = 8,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen, closePopover, popoverId, anchorRef } = usePopoverContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });

    const updatePosition = useCallback(() => {
      if (!anchorRef.current || !contentRef.current) return;
      const pos = getOverlayPosition({
        anchorElement: anchorRef.current,
        overlayElement: contentRef.current,
        placement,
        align,
        offset,
      });
      setCoords(pos);
    }, [anchorRef, placement, align, offset]);

    useEffect(() => {
      if (!isOpen) return;

      updatePosition();

      const handleScrollOrResize = () => {
        updatePosition();
      };

      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);

      return () => {
        window.removeEventListener('scroll', handleScrollOrResize, true);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }, [isOpen, updatePosition]);

    useOutsideInteraction({
      active: isOpen && closeOnOutsideClick,
      refs: [contentRef, anchorRef],
      onOutsideInteraction: closePopover,
    });

    useEffect(() => {
      if (!isOpen) return;

      const unregister = registerOverlay({
        id: popoverId,
        type: 'popover',
        dismissible: closeOnEscape,
        onEscape: closePopover,
        priority: 1100,
      });

      return () => unregister();
    }, [isOpen, closeOnEscape, closePopover, popoverId]);

    if (!isOpen) return null;

    return (
      <Portal>
        <div
          ref={(node) => {
            contentRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                node;
          }}
          id={popoverId}
          role="group"
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          className={cn(
            'z-dropdown bg-surface text-content-primary p-4 rounded-md border border-stroke-subtle shadow-lg focus:outline-none',
            'transition-all duration-150 ease-cinematic',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </Portal>
    );
  }
);
PopoverContent.displayName = 'Popover.Content';

/* -------------------------------------------------------------------------- */
/*                               Popover Close                                */
/* -------------------------------------------------------------------------- */

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { closePopover } = usePopoverContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      closePopover();
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          closePopover();
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
PopoverClose.displayName = 'Popover.Close';

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
});
