import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { NavigationItem, NavigationSection } from '../types/shell.types';
import { useShellState } from '../ShellContext/ShellContext';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';

export interface SidebarProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  sections?: NavigationSection[];
  items?: NavigationItem[];
  activeId?: string;
  onSelect?: (item: NavigationItem) => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      sections,
      items,
      activeId,
      onSelect,
      headerSlot,
      footerSlot,
      className,
      ...props
    },
    ref
  ) => {
    const { sidebarCollapsed } = useShellState();

    return (
      <aside
        ref={ref}
        aria-label="Sidebar navigation"
        className={cn(
          'hidden md:flex flex-col shrink-0 h-full bg-surface border-r border-stroke-subtle z-sidebar select-none',
          'transition-[width] duration-200 ease-cinematic',
          sidebarCollapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      >
        {headerSlot && (
          <div className="shrink-0 p-3 border-b border-stroke-subtle flex items-center justify-between min-h-[56px]">
            {headerSlot}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1">
          {sections && sections.length > 0
            ? sections.map((sec) => (
                <SidebarSection
                  key={sec.id}
                  title={sec.title}
                  collapsed={sidebarCollapsed}
                >
                  {sec.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      active={activeId === item.id || activeId === item.href}
                      collapsed={sidebarCollapsed}
                      onSelect={onSelect}
                    />
                  ))}
                </SidebarSection>
              ))
            : items?.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  active={activeId === item.id || activeId === item.href}
                  collapsed={sidebarCollapsed}
                  onSelect={onSelect}
                />
              ))}
        </nav>

        {footerSlot && (
          <div className="shrink-0 p-3 border-t border-stroke-subtle flex items-center justify-between">
            {footerSlot}
          </div>
        )}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';
