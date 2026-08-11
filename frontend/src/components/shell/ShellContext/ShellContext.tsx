import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { ShellState, ShellSidebarConfig } from '../types/shell.types';

const SHELL_SIDEBAR_STORAGE_KEY = 'marvelverse-shell-sidebar-collapsed';

function readStoredSidebarState(fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(SHELL_SIDEBAR_STORAGE_KEY);
    if (item !== null) {
      return item === 'true';
    }
  } catch (e) {
    // Ignore storage errors (private browsing, security restrictions)
  }
  return fallback;
}

function writeStoredSidebarState(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SHELL_SIDEBAR_STORAGE_KEY, String(value));
  } catch (e) {
    // Ignore storage write errors
  }
}

export interface ShellActionsContextValue {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
}

export const ShellStateContext = createContext<ShellState | undefined>(
  undefined
);
export const ShellActionsContext = createContext<
  ShellActionsContextValue | undefined
>(undefined);

export const useShellState = (): ShellState => {
  const context = useContext(ShellStateContext);
  if (!context) {
    throw new Error('useShellState must be used within <ShellProvider>');
  }
  return context;
};

export const useShellActions = (): ShellActionsContextValue => {
  const context = useContext(ShellActionsContext);
  if (!context) {
    throw new Error('useShellActions must be used within <ShellProvider>');
  }
  return context;
};

export const useShell = () => {
  const state = useShellState();
  const actions = useShellActions();
  return {
    ...state,
    ...actions,
  };
};

export interface ShellProviderProps {
  children: React.ReactNode;
  sidebarConfig?: ShellSidebarConfig;
}

export const ShellProvider: React.FC<ShellProviderProps> = ({
  children,
  sidebarConfig = {},
}) => {
  const { defaultCollapsed = false, persist = true } = sidebarConfig;

  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    if (persist) {
      return readStoredSidebarState(defaultCollapsed);
    }
    return defaultCollapsed;
  });

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const setSidebarCollapsed = useCallback(
    (collapsed: boolean) => {
      setSidebarCollapsedState(collapsed);
      if (persist) {
        writeStoredSidebarState(collapsed);
      }
    },
    [persist]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsedState((prev) => {
      const next = !prev;
      if (persist) {
        writeStoredSidebarState(next);
      }
      return next;
    });
  }, [persist]);

  const openMobileNav = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen((prev) => !prev);
  }, []);

  const stateValue = useMemo<ShellState>(
    () => ({
      sidebarCollapsed,
      mobileNavOpen,
    }),
    [sidebarCollapsed, mobileNavOpen]
  );

  const actionsValue = useMemo<ShellActionsContextValue>(
    () => ({
      toggleSidebar,
      setSidebarCollapsed,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
    }),
    [
      toggleSidebar,
      setSidebarCollapsed,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
    ]
  );

  return (
    <ShellStateContext.Provider value={stateValue}>
      <ShellActionsContext.Provider value={actionsValue}>
        {children}
      </ShellActionsContext.Provider>
    </ShellStateContext.Provider>
  );
};

ShellProvider.displayName = 'ShellProvider';
