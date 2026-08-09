import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonComponent = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'animate-pulse bg-surface-raised rounded-md shrink-0 select-none',
          className
        )}
        {...props}
      />
    );
  }
);
SkeletonComponent.displayName = 'Skeleton';

export interface SkeletonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const SkeletonGroup = forwardRef<HTMLDivElement, SkeletonGroupProps>(
  ({ label = 'Loading content...', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label={label}
        className={cn('flex flex-col gap-3 w-full', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SkeletonGroup.displayName = 'Skeleton.Group';

export const Skeleton = Object.assign(SkeletonComponent, {
  Group: SkeletonGroup,
});
