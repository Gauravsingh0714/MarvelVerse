import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useId,
  useRef,
  useCallback,
} from 'react';
import { cn } from '../../../utils/cn';

export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
  registerTab: (value: string, disabled: boolean) => void;
  unregisterTab: (value: string) => void;
  tabValues: { value: string; disabled: boolean }[];
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      'Tabs subcomponents must be rendered within a <Tabs> container.'
    );
  }
  return context;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const TabsComponent = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue || ''
    );
    const isControlled = controlledValue !== undefined;
    const activeTab = isControlled ? controlledValue : internalValue;

    const baseId = useId();
    const [tabs, setTabs] = useState<{ value: string; disabled: boolean }[]>(
      []
    );

    const registerTab = useCallback((value: string, disabled: boolean) => {
      setTabs((prev) => {
        if (prev.some((t) => t.value === value)) return prev;
        return [...prev, { value, disabled }];
      });
    }, []);

    const unregisterTab = useCallback((value: string) => {
      setTabs((prev) => prev.filter((t) => t.value !== value));
    }, []);

    const setActiveTab = useCallback(
      (val: string) => {
        if (!isControlled) {
          setInternalValue(val);
        }
        onValueChange?.(val);
      },
      [isControlled, onValueChange]
    );

    return (
      <TabsContext.Provider
        value={{
          activeTab,
          setActiveTab,
          baseId,
          registerTab,
          unregisterTab,
          tabValues: tabs,
        }}
      >
        <div
          ref={ref}
          className={cn('flex flex-col w-full', className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
TabsComponent.displayName = 'Tabs';

/* -------------------------------------------------------------------------- */
/*                                 Tabs.List                                  */
/* -------------------------------------------------------------------------- */

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ 'aria-label': ariaLabel, className, children, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || listRef;
    const { activeTab, setActiveTab, tabValues, baseId } = useTabsContext();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabledTabs = tabValues.filter((t) => !t.disabled);
      if (enabledTabs.length === 0) return;

      const currentIndex = enabledTabs.findIndex((t) => t.value === activeTab);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex =
          (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = enabledTabs.length - 1;
      } else {
        return;
      }

      const nextTab = enabledTabs[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.value);
        // Focus the corresponding button element
        const buttonEl = document.getElementById(
          `tab-${baseId}-${nextTab.value}`
        );
        buttonEl?.focus();
      }
    };

    return (
      <div
        ref={combinedRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-stroke-subtle',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'Tabs.List';

/* -------------------------------------------------------------------------- */
/*                                Tabs.Trigger                                */
/* -------------------------------------------------------------------------- */

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled = false, className, children, ...props }, ref) => {
    const { activeTab, setActiveTab, baseId, registerTab, unregisterTab } =
      useTabsContext();

    const isActive = activeTab === value;
    const tabId = `tab-${baseId}-${value}`;
    const panelId = `panel-${baseId}-${value}`;

    React.useEffect(() => {
      registerTab(value, disabled);
      return () => unregisterTab(value);
    }, [value, disabled, registerTab, unregisterTab]);

    return (
      <button
        ref={ref}
        id={tabId}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={() => !disabled && setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded transition-all duration-150 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
          'disabled:opacity-disabled disabled:cursor-not-allowed',
          isActive
            ? 'bg-surface text-content-primary shadow-sm border border-stroke-subtle'
            : 'text-content-secondary hover:text-content-primary hover:bg-surface/50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'Tabs.Trigger';

/* -------------------------------------------------------------------------- */
/*                                Tabs.Content                                */
/* -------------------------------------------------------------------------- */

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, baseId } = useTabsContext();
    const isActive = activeTab === value;

    const tabId = `tab-${baseId}-${value}`;
    const panelId = `panel-${baseId}-${value}`;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        tabIndex={0}
        className={cn(
          'mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-focus rounded-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'Tabs.Content';

export const Tabs = Object.assign(TabsComponent, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
