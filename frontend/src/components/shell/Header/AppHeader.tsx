import React, { forwardRef } from 'react';
import { PanelLeft, Menu } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { IconButton } from '../../ui/Button/Button';
import { useShell } from '../ShellContext/ShellContext';

export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  leading?: React.ReactNode;
  center?: React.ReactNode;
  trailing?: React.ReactNode;
  mobileLeading?: React.ReactNode;
  mobileTrailing?: React.ReactNode;
  showSidebarToggle?: boolean;
}

export const AppHeader = forwardRef<HTMLElement, AppHeaderProps>(
  (
    {
      leading,
      center,
      trailing,
      mobileLeading,
      mobileTrailing,
      showSidebarToggle = true,
      className,
      ...props
    },
    ref
  ) => {
    const { toggleSidebar, openMobileNav, sidebarCollapsed } = useShell();

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-header h-14 bg-surface/90 backdrop-blur-md border-b border-stroke-subtle px-4 flex items-center justify-between shrink-0 gap-4',
          className
        )}
        {...props}
      >
        {/* Mobile View Header */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <IconButton
              variant="ghost"
              size="sm"
              icon={
                <Menu
                  className="w-5 h-5 text-content-primary"
                  aria-hidden="true"
                />
              }
              aria-label="Open mobile navigation"
              onClick={openMobileNav}
            />
            {mobileLeading || leading}
          </div>
          {mobileTrailing || trailing}
        </div>

        {/* Desktop View Header */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <IconButton
                variant="ghost"
                size="sm"
                icon={
                  <PanelLeft
                    className="w-4 h-4 text-content-secondary hover:text-content-primary transition-colors"
                    aria-hidden="true"
                  />
                }
                aria-label={
                  sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                }
                onClick={toggleSidebar}
              />
            )}
            {leading}
          </div>

          {center && (
            <div className="flex-1 flex justify-center max-w-md mx-4">
              {center}
            </div>
          )}

          {trailing && (
            <div className="flex items-center gap-3">{trailing}</div>
          )}
        </div>
      </header>
    );
  }
);

AppHeader.displayName = 'AppHeader';
