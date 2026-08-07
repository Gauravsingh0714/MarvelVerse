import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type CenterAxis = 'horizontal' | 'vertical' | 'both';

export interface CenterOwnProps {
  axis?: CenterAxis;
  viewport?: boolean;
  text?: boolean;
  className?: string;
}

export type CenterProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, CenterOwnProps>;

export const Center = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      axis = 'both',
      viewport = false,
      text = false,
      className,
      children,
      ...props
    }: CenterProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    const isHorizontal = axis === 'horizontal' || axis === 'both';
    const isVertical = axis === 'vertical' || axis === 'both';

    return (
      <Component
        ref={ref}
        className={cn(
          'flex',
          isHorizontal && 'justify-center',
          isVertical && 'items-center',
          viewport && 'min-h-screen w-full',
          text && 'text-center',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'div'>(
  props: CenterProps<C>
) => React.ReactElement | null;

(Center as React.FC).displayName = 'Center';
