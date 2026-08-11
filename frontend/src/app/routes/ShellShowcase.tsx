import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Library,
  Bookmark,
  Settings,
  Terminal,
  Bell,
  Sun,
  Moon,
  SunMoon,
  Search,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import {
  AppShell,
  Breadcrumbs,
  PageHeader,
  SecondaryNav,
  NavigationSection,
  NavigationItem,
  BreadcrumbItemData,
} from '../../components/shell';
import { Button, IconButton } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { DropdownMenu } from '../../components/overlay/DropdownMenu/DropdownMenu';
import { Dialog } from '../../components/overlay/Dialog/Dialog';
import { useToast } from '../../components/overlay/Toast/useToast';
import { useTheme } from '../../hooks/useTheme';

const sampleNavSections: NavigationSection[] = [
  {
    id: 'main',
    title: 'Core Platform',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      {
        id: 'explore',
        label: 'Explore Engine',
        icon: <Compass className="w-4 h-4" />,
        badge: <Badge variant="primary">v1.6</Badge>,
      },
      {
        id: 'library',
        label: 'Asset Library',
        icon: <Library className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'system',
    title: 'System Services',
    items: [
      {
        id: 'favorites',
        label: 'Saved Bookmarks',
        icon: <Bookmark className="w-4 h-4" />,
      },
      {
        id: 'telemetry',
        label: 'System Logs',
        icon: <Terminal className="w-4 h-4" />,
      },
      {
        id: 'settings',
        label: 'Configuration',
        icon: <Settings className="w-4 h-4" />,
        disabled: true,
      },
    ],
  },
];

const sampleBreadcrumbs: BreadcrumbItemData[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'System Showcase', href: '/showcase/shell' },
  { id: '3', label: 'Application Shell' },
];

const secondaryNavItems = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'telemetry',
    label: 'Telemetry',
    badge: <Badge variant="vibranium">Live</Badge>,
  },
  { id: 'audit', label: 'Audit Logs' },
  { id: 'settings', label: 'Settings', disabled: true },
];

export const ShellShowcasePage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeSecondaryNav, setActiveSecondaryNav] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { mode, setMode } = useTheme();

  const handleNavSelect = (item: NavigationItem) => {
    setActiveNav(item.id);
    toast({
      title: 'Navigation Changed',
      description: `Active route: ${item.label}`,
      variant: 'info',
    });
  };

  const handleThemeToggle = () => {
    const nextMode =
      mode === 'dark' ? 'light' : mode === 'light' ? 'high-contrast' : 'dark';
    setMode(nextMode);
    toast({
      title: 'Theme Updated',
      description: `Active theme mode: ${nextMode.toUpperCase()}`,
      variant: 'success',
    });
  };

  return (
    <AppShell
      navigation={{ sections: sampleNavSections }}
      activeNavId={activeNav}
      onNavSelect={handleNavSelect}
      sidebarConfig={{
        collapsible: true,
        defaultCollapsed: false,
        persist: true,
      }}
      sidebarHeaderSlot={
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-md bg-content-accent flex items-center justify-center font-bold text-white text-xs">
            MV
          </div>
          <span className="font-bold text-sm tracking-tight text-content-primary truncate">
            MarvelVerse
          </span>
        </div>
      }
      sidebarFooterSlot={
        <div className="flex items-center gap-2 text-xs text-content-secondary truncate">
          <ShieldAlert className="w-4 h-4 text-statusSuccess shrink-0" />
          <span className="truncate">Stage 1.6 Verified</span>
        </div>
      }
      headerSlots={{
        leading: (
          <span className="font-bold text-sm text-content-primary">
            App Shell System
          </span>
        ),
        center: (
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <Input
              placeholder="Search components or settings..."
              className="pl-8 text-xs h-8 bg-surface-raised/40 border-stroke-subtle"
            />
          </div>
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

            <IconButton
              variant="ghost"
              size="sm"
              icon={<Bell className="w-4 h-4 text-content-secondary" />}
              aria-label="Notifications"
            />

            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="focus:outline-none rounded-full"
                >
                  <Avatar name="System Admin" size="sm" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content placement="bottom" align="end">
                <DropdownMenu.Label>Administrator</DropdownMenu.Label>
                <DropdownMenu.Item onClick={() => setIsDialogOpen(true)}>
                  System Info
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onClick={() =>
                    toast({
                      title: 'Session Cleared',
                      description: 'Development session reset.',
                      variant: 'warning',
                    })
                  }
                >
                  Reset Session
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </>
        ),
      }}
      footerSlot={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-content-secondary">
          <span>MarvelVerse Core Engineering Foundation</span>
          <span>Stage 1.6 — Reusable Application Shell</span>
        </div>
      }
    >
      <Breadcrumbs items={sampleBreadcrumbs} className="mb-4" />

      <PageHeader
        eyebrow="Stage 1.6 Architecture"
        title="Application Shell System"
        description="Reusable structural layout foundation for MarvelVerse pages. Features collapsible desktop sidebar, responsive mobile drawer, composable slot header, and accessible navigation landmarks."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              View Specs
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                toast({
                  title: 'Action Executed',
                  description: 'Stage 1.6 verification trigger success.',
                  variant: 'success',
                })
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Deploy Component
            </Button>
          </>
        }
        tabs={
          <SecondaryNav
            items={secondaryNavItems}
            activeId={activeSecondaryNav}
            onSelect={(item) => setActiveSecondaryNav(item.id)}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-sm text-content-primary">
            Desktop Sidebar
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Collapses to icon-only view with accessible tooltip labels.
            Persistent state using namespaced localStorage key.
          </p>
          <Badge variant="success" className="self-start">
            Active & Verified
          </Badge>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-sm text-content-primary">
            Mobile Navigation
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Consumes existing Stage 1.5 Drawer with portal rendering, focus
            trap, scroll lock, and OverlayStack Escape dismissal.
          </p>
          <Badge variant="success" className="self-start">
            Drawer Reused
          </Badge>
        </Card>

        <Card className="p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-sm text-content-primary">
            Theme Engine
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            Zero raw hex colors. Consumes Stage 1.1 tokens across dark, light,
            and high-contrast modes dynamically.
          </p>
          <Badge variant="primary" className="self-start">
            Tokens Enforced
          </Badge>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Stage 1.6 System Architecture</Dialog.Title>
            <Dialog.Description>
              Technical specifications of the Application Shell System.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body className="text-xs text-content-secondary space-y-2">
            <p>
              <strong>Dependency Direction:</strong> Tokens → Theme Runtime →
              Layout → Core UI → Overlay → Shell
            </p>
            <p>
              <strong>State Management:</strong> Partitioned ShellContext (State
              & Actions)
            </p>
            <p>
              <strong>Accessibility:</strong> Semantic nav landmarks,
              aria-current, focus restoration
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm">
                Close
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </AppShell>
  );
};

export default ShellShowcasePage;
