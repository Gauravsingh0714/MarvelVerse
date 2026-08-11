import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  NavigationItem,
  NavigationSection,
  ShellSidebarConfig,
} from '../types/shell.types';
import { ShellProvider } from '../ShellContext/ShellContext';
import { Sidebar } from '../Sidebar/Sidebar';
import { MobileNav } from '../MobileNav/MobileNav';
import { AppHeader } from '../Header/AppHeader';
import { Container } from '../../layout/Container/Container';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  navigation?: {
    sections?: NavigationSection[];
    items?: NavigationItem[];
  };
  activeNavId?: string;
  onNavSelect?: (item: NavigationItem) => void;
  sidebarConfig?: ShellSidebarConfig;
  headerSlots?: {
    leading?: React.ReactNode;
    center?: React.ReactNode;
    trailing?: React.ReactNode;
    mobileLeading?: React.ReactNode;
    mobileTrailing?: React.ReactNode;
    showSidebarToggle?: boolean;
  };
  sidebarHeaderSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

const AppShellContent = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      navigation,
      activeNavId,
      onNavSelect,
      headerSlots,
      sidebarHeaderSlot,
      sidebarFooterSlot,
      footerSlot,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex flex-col bg-canvas text-content-primary',
          className
        )}
        {...props}
      >
        <AppHeader
          leading={headerSlots?.leading}
          center={headerSlots?.center}
          trailing={headerSlots?.trailing}
          mobileLeading={headerSlots?.mobileLeading}
          mobileTrailing={headerSlots?.mobileTrailing}
          showSidebarToggle={headerSlots?.showSidebarToggle}
        />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            sections={navigation?.sections}
            items={navigation?.items}
            activeId={activeNavId}
            onSelect={onNavSelect}
            headerSlot={sidebarHeaderSlot}
            footerSlot={sidebarFooterSlot}
          />

          <MobileNav
            sections={navigation?.sections}
            items={navigation?.items}
            activeId={activeNavId}
            onSelect={onNavSelect}
            brandSlot={headerSlots?.mobileLeading || headerSlots?.leading}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
            <Container size="2xl" padding="none" className="flex-1">
              {children}
            </Container>

            {footerSlot && (
              <footer className="mt-12 pt-4 border-t border-stroke-subtle text-xs text-content-secondary">
                {footerSlot}
              </footer>
            )}
          </main>
        </div>
      </div>
    );
  }
);
AppShellContent.displayName = 'AppShellContent';

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  ({ sidebarConfig, ...props }, ref) => {
    return (
      <ShellProvider sidebarConfig={sidebarConfig}>
        <AppShellContent ref={ref} {...props} />
      </ShellProvider>
    );
  }
);
AppShell.displayName = 'AppShell';
