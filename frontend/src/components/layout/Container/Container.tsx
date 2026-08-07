import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerOwnProps {
  size?: ContainerSize;
  padding?: ContainerPadding;
  centered?: boolean;
  className?: string;
}

export type ContainerProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, ContainerOwnProps>;

const sizeVariants: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

const paddingVariants: Record<ContainerPadding, string> = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
};

export const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      size = '2xl',
      padding = 'md',
      centered = true,
      className,
      children,
      ...props
    }: ContainerProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          'w-full',
          sizeVariants[size],
          paddingVariants[padding],
          centered && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'div'>(
  props: ContainerProps<C>
) => React.ReactElement | null;

(Container as React.FC).displayName = 'Container';
