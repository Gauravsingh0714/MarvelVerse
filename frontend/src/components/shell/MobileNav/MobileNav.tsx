import React from 'react';
import { Drawer } from '../../overlay/Drawer/Drawer';
import { useShell } from '../ShellContext/ShellContext';
import { NavigationItem, NavigationSection } from '../types/shell.types';
import { SidebarSection } from '../Sidebar/SidebarSection';
import { SidebarItem } from '../Sidebar/SidebarItem';

export interface MobileNavProps {
  sections?: NavigationSection[];
  items?: NavigationItem[];
  activeId?: string;
  onSelect?: (item: NavigationItem) => void;
  brandSlot?: React.ReactNode;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  sections,
  items,
  activeId,
  onSelect,
  brandSlot,
}) => {
  const { mobileNavOpen, closeMobileNav } = useShell();

  const handleSelect = (item: NavigationItem) => {
    onSelect?.(item);
    closeMobileNav();
  };

  return (
    <Drawer
      open={mobileNavOpen}
      onOpenChange={(open) => !open && closeMobileNav()}
    >
      <Drawer.Content side="left" className="w-[280px]">
        <Drawer.Header className="flex items-center justify-between">
          <Drawer.Title className="text-base">
            {brandSlot || 'Navigation'}
          </Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className="p-2">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {sections && sections.length > 0
              ? sections.map((sec) => (
                  <SidebarSection
                    key={sec.id}
                    title={sec.title}
                    collapsed={false}
                  >
                    {sec.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        active={activeId === item.id || activeId === item.href}
                        collapsed={false}
                        onSelect={handleSelect}
                      />
                    ))}
                  </SidebarSection>
                ))
              : items?.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    active={activeId === item.id || activeId === item.href}
                    collapsed={false}
                    onSelect={handleSelect}
                  />
                ))}
          </nav>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
};

MobileNav.displayName = 'MobileNav';
