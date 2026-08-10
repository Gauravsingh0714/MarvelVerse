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
/*                            DropdownMenu Context                            */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuContextValue {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  menuId: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | undefined>(
  undefined
);

export const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      'DropdownMenu subcomponents must be used within <DropdownMenu>'
    );
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                            DropdownMenu Root                               */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuRoot: React.FC<DropdownMenuProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const anchorRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const generatedId = useId();
  const menuId = `dropdown-menu-${generatedId}`;

  const openMenu = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const closeMenu = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
    setFocusedIndex(-1);

    // Restore focus to trigger button
    if (anchorRef.current && typeof anchorRef.current.focus === 'function') {
      anchorRef.current.focus();
    }
  }, [isControlled, onOpenChange]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, closeMenu, openMenu]);

  const contextValue: DropdownMenuContextValue = {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    menuId,
    anchorRef,
    contentRef,
    focusedIndex,
    setFocusedIndex,
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                          DropdownMenu Trigger                              */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ children, asChild = false, onClick, onKeyDown, ...props }, ref) => {
  const { isOpen, toggleMenu, openMenu, menuId, anchorRef } =
    useDropdownMenuContext();

  const handleRef = (node: HTMLButtonElement | null) => {
    (anchorRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref)
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    toggleMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault();
      openMenu();
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(e);
        toggleMenu();
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        child.props.onKeyDown?.(e);
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault();
          openMenu();
        }
      },
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': menuId,
      ref: handleRef as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      ref={handleRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={menuId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger';

/* -------------------------------------------------------------------------- */
/*                          DropdownMenu Content                              */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: OverlayPlacement;
  align?: OverlayAlign;
  offset?: number;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      placement = 'bottom',
      align = 'start',
      offset = 4,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      className,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const {
      isOpen,
      closeMenu,
      menuId,
      anchorRef,
      contentRef,
      focusedIndex,
      setFocusedIndex,
    } = useDropdownMenuContext();

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
    }, [anchorRef, contentRef, placement, align, offset]);

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

    // Keyboard navigation helper
    const getMenuItems = useCallback((): HTMLElement[] => {
      if (!contentRef.current) return [];
      return Array.from(
        contentRef.current.querySelectorAll<HTMLElement>(
          '[role="menuitem"]:not([aria-disabled="true"])'
        )
      );
    }, [contentRef]);

    // Initial focus on open
    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          const items = getMenuItems();
          if (items.length > 0) {
            setFocusedIndex(0);
            items[0].focus();
          }
        }, 16);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isOpen, getMenuItems, setFocusedIndex]);

    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);

      const items = getMenuItems();
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (focusedIndex + 1) % items.length;
        setFocusedIndex(nextIndex);
        items[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (focusedIndex - 1 + items.length) % items.length;
        setFocusedIndex(prevIndex);
        items[prevIndex]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setFocusedIndex(0);
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = items.length - 1;
        setFocusedIndex(lastIndex);
        items[lastIndex]?.focus();
      } else if (e.key === 'Tab') {
        closeMenu();
      }
    };

    useOutsideInteraction({
      active: isOpen && closeOnOutsideClick,
      refs: [contentRef, anchorRef],
      onOutsideInteraction: closeMenu,
    });

    useEffect(() => {
      if (!isOpen) return;

      const unregister = registerOverlay({
        id: menuId,
        type: 'dropdown',
        dismissible: closeOnEscape,
        onEscape: closeMenu,
        priority: 1100,
      });

      return () => unregister();
    }, [isOpen, closeOnEscape, closeMenu, menuId]);

    if (!isOpen) return null;

    return (
      <Portal>
        <div
          ref={(node) => {
            (
              contentRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                node;
          }}
          id={menuId}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuKeyDown}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          className={cn(
            'z-dropdown min-w-[160px] p-1 bg-surface text-content-primary rounded-md border border-stroke-subtle shadow-lg focus:outline-none flex flex-col gap-0.5',
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
DropdownMenuContent.displayName = 'DropdownMenu.Content';

/* -------------------------------------------------------------------------- */
/*                            DropdownMenu Item                               */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  asChild?: boolean;
}

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  (
    {
      children,
      disabled = false,
      asChild = false,
      onClick,
      onKeyDown,
      className,
      ...props
    },
    ref
  ) => {
    const { closeMenu } = useDropdownMenuContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      closeMenu();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
        closeMenu();
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.HTMLAttributes<HTMLElement>
      >;
      return React.cloneElement(child, {
        role: 'menuitem',
        'aria-disabled': disabled,
        tabIndex: disabled ? -1 : 0,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          if (disabled) return;
          child.props.onClick?.(e);
          closeMenu();
        },
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-disabled={disabled}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full text-left px-3 py-1.5 text-xs font-medium rounded text-content-primary transition-colors flex items-center justify-between',
          'hover:bg-surface-raised focus:bg-surface-raised focus:outline-none',
          disabled &&
            'opacity-disabled cursor-not-allowed hover:bg-transparent focus:bg-transparent',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenu.Item';

/* -------------------------------------------------------------------------- */
/*                           DropdownMenu Subcomponents                       */
/* -------------------------------------------------------------------------- */

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-3 py-1.5 text-[11px] font-semibold text-content-muted uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DropdownMenuLabel.displayName = 'DropdownMenu.Label';

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn('my-1 h-px bg-stroke-subtle w-full', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenu.Separator';

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
});
