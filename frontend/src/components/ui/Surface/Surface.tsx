import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type SurfaceVariant = 'surface' | 'raised' | 'overlay' | 'transparent';
export type SurfaceBorder = 'none' | 'subtle' | 'default' | 'strong';
export type SurfaceElevation = 'none' | 'sm' | 'md' | 'lg';

export interface SurfaceOwnProps {
  variant?: SurfaceVariant;
  border?: SurfaceBorder;
  elevation?: SurfaceElevation;
  glass?: boolean;
  className?: string;
}

export type SurfaceProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, SurfaceOwnProps>;

const variantClasses: Record<SurfaceVariant, string> = {
  surface: 'bg-surface text-content-primary',
  raised: 'bg-surface-raised text-content-primary',
  overlay: 'bg-surface-overlay text-content-primary',
  transparent: 'bg-transparent text-content-primary',
};

const borderClasses: Record<SurfaceBorder, string> = {
  none: 'border-0',
  subtle: 'border border-stroke-subtle',
  default: 'border border-stroke',
  strong: 'border border-stroke-focus',
};

const elevationClasses: Record<SurfaceElevation, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export const Surface = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      variant = 'surface',
      border = 'subtle',
      elevation = 'none',
      glass = false,
      className,
      children,
      ...props
    }: SurfaceProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-md',
          variantClasses[variant],
          borderClasses[border],
          elevationClasses[elevation],
          glass && 'backdrop-blur-md bg-surface-glass',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'div'>(
  props: SurfaceProps<C>
) => React.ReactElement | null;

(Surface as React.FC).displayName = 'Surface';
