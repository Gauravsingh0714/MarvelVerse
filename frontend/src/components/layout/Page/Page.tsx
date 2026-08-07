import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type PagePadding = 'none' | 'compact' | 'normal' | 'large';

export interface PageOwnProps {
  padding?: PagePadding;
  className?: string;
}

export type PageProps<C extends React.ElementType = 'main'> =
  PolymorphicComponentPropsWithRef<C, PageOwnProps>;

const paddingVariants: Record<PagePadding, string> = {
  none: 'py-0',
  compact: 'py-4',
  normal: 'py-8',
  large: 'py-12',
};

export const Page = forwardRef(
  <C extends React.ElementType = 'main'>(
    { as, padding = 'none', className, children, ...props }: PageProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'main';

    return (
      <Component
        ref={ref}
        className={cn(
          'min-h-screen w-full bg-canvas text-content-primary flex flex-col',
          paddingVariants[padding],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'main'>(
  props: PageProps<C>
) => React.ReactElement | null;

(Page as React.FC).displayName = 'Page';
