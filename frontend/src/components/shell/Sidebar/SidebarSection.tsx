import React from 'react';
import { cn } from '../../../utils/cn';

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  collapsed = false,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-1 py-1.5', className)} {...props}>
      {title && !collapsed && (
        <h3 className="px-3 py-1 text-[10px] font-bold text-content-muted uppercase tracking-wider select-none">
          {title}
        </h3>
      )}
      {title && collapsed && (
        <div className="my-1 mx-2 h-px bg-stroke-subtle/50" />
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
};

SidebarSection.displayName = 'SidebarSection';
