import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useMatches } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Library,
  Settings,
  ShieldAlert,
  Sun,
  Moon,
  SunMoon,
} from 'lucide-react';
import {
  AppShell,
  Breadcrumbs,
  NavigationSection,
  NavigationItem,
  BreadcrumbItemData,
} from '../../components/shell';
import { useShellActions } from '../../components/shell/ShellContext/ShellContext';
import { IconButton } from '../../components/ui/Button/Button';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { DropdownMenu } from '../../components/overlay/DropdownMenu/DropdownMenu';
import { useTheme } from '../../hooks/useTheme';
import { RouteHandleMeta } from '../types/route.types';

export interface UIRouteMatch {
  id: string;
  pathname: string;
  params: Record<string, string | undefined>;
  data: unknown;
  handle?: RouteHandleMeta;
}

const appNavigationSections: NavigationSection[] = [
  {
    id: 'platform',
    title: 'Platform Navigation',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/app/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'explore',
        label: 'Explore Engine',
        href: '/app/explore',
        icon: <Compass className="w-4 h-4" />,
      },
      {
        id: 'library',
        label: 'Asset Library',
        href: '/app/library',
        icon: <Library className="w-4 h-4" />,
      },
      {
        id: 'settings',
        label: 'System Settings',
        href: '/app/settings',
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
];

/** Strict segment boundary route matching */
function isRouteActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (pathname === href) return true;
  return pathname.startsWith(href + '/');
}

export const AppLayoutContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches() as UIRouteMatch[];
  const { closeMobileNav } = useShellActions();
  const { mode, setMode } = useTheme();

  // Auto-close mobile drawer on route change
  useEffect(() => {
    closeMobileNav();
  }, [location.pathname, closeMobileNav]);

  // Derive active item ID from URL (URL is single source of truth)
  const activeNavId = useMemo(() => {
    const matchedItem = appNavigationSections[0].items.find((item) =>
      isRouteActive(location.pathname, item.href)
    );
    return matchedItem ? matchedItem.id : 'dashboard';
  }, [location.pathname]);

  // Derive breadcrumbs dynamically from route handles or path segments
  const breadcrumbs = useMemo<BreadcrumbItemData[]>(() => {
    const items: BreadcrumbItemData[] = [
      { id: 'app-root', label: 'App', href: '/app/dashboard' },
    ];

    matches.forEach((match, idx) => {
      if (match.handle?.breadcrumb) {
        const label =
          typeof match.handle.breadcrumb === 'string'
            ? match.handle.breadcrumb
            : match.handle.breadcrumb(match.params);
        items.push({
          id: `match-${idx}`,
          label,
          href:
            match.pathname !== location.pathname ? match.pathname : undefined,
        });
      }
    });

    return items;
  }, [matches, location.pathname]);

  const handleNavSelect = (item: NavigationItem) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  const handleThemeToggle = () => {
    const nextMode =
      mode === 'dark' ? 'light' : mode === 'light' ? 'high-contrast' : 'dark';
    setMode(nextMode);
  };

  return (
    <AppShell
      navigation={{ sections: appNavigationSections }}
      activeNavId={activeNavId}
      onNavSelect={handleNavSelect}
      sidebarConfig={{
        collapsible: true,
        defaultCollapsed: false,
        persist: true,
      }}
      sidebarHeaderSlot={
        <div
          className="flex items-center gap-2 px-1 cursor-pointer"
          onClick={() => navigate('/app/dashboard')}
        >
          <div className="w-7 h-7 rounded-md bg-content-accent flex items-center justify-center font-bold text-white text-xs select-none">
            MV
          </div>
          <span className="font-bold text-sm tracking-tight text-content-primary truncate select-none">
            MarvelVerse App
          </span>
        </div>
      }
      sidebarFooterSlot={
        <div className="flex items-center gap-2 text-xs text-content-secondary truncate">
          <ShieldAlert className="w-4 h-4 text-statusSuccess shrink-0" />
          <span className="truncate">Stage 1.7 Router Active</span>
        </div>
      }
      headerSlots={{
        leading: (
          <span className="font-bold text-sm text-content-primary select-none">
            MarvelVerse Platform
          </span>
        ),
        trailing: (
          <>
            <IconButton
              variant="ghost"
              size="sm"
              icon={
                mode === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : mode === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <SunMoon className="w-4 h-4" />
                )
              }
              aria-label="Toggle theme mode"
              onClick={handleThemeToggle}
            />

            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="focus:outline-none rounded-full"
                >
                  <Avatar name="MarvelVerse User" size="sm" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content placement="bottom" align="end">
                <DropdownMenu.Label>User Account</DropdownMenu.Label>
                <DropdownMenu.Item onClick={() => navigate('/app/settings')}>
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onClick={() => navigate('/')}>
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </>
        ),
      }}
      footerSlot={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-content-secondary">
          <span>MarvelVerse Engineering Platform</span>
          <span>Stage 1.7 — Navigation & Routing Foundation</span>
        </div>
      }
    >
      <Breadcrumbs items={breadcrumbs} className="mb-4" />
      <Outlet />
    </AppShell>
  );
};

export const AppLayout: React.FC = () => {
  return <AppLayoutContent />;
};

export default AppLayout;
