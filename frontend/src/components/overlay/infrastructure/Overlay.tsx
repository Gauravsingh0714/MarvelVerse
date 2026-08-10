import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  blur?: boolean;
  className?: string;
}

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ visible = true, blur = true, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-modal bg-canvas/80 transition-opacity duration-200 ease-cinematic',
          blur && 'backdrop-blur-sm',
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
          className
        )}
        {...props}
      />
    );
  }
);

Overlay.displayName = 'Overlay';
