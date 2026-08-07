import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type SectionSpacing = 'compact' | 'normal' | 'large' | 'hero';

export interface SectionOwnProps {
  spacing?: SectionSpacing;
  borderTop?: boolean;
  borderBottom?: boolean;
  className?: string;
}

export type SectionProps<C extends React.ElementType = 'section'> =
  PolymorphicComponentPropsWithRef<C, SectionOwnProps>;

const spacingVariants: Record<SectionSpacing, string> = {
  compact: 'py-8', // 32px
  normal: 'py-16', // 64px
  large: 'py-24', // 96px
  hero: 'py-32', // 128px
};

export const Section = forwardRef(
  <C extends React.ElementType = 'section'>(
    {
      as,
      spacing = 'normal',
      borderTop = false,
      borderBottom = false,
      className,
      children,
      ...props
    }: SectionProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'section';

    return (
      <Component
        ref={ref}
        className={cn(
          'w-full relative',
          spacingVariants[spacing],
          borderTop && 'border-t border-stroke-subtle',
          borderBottom && 'border-b border-stroke-subtle',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'section'>(
  props: SectionProps<C>
) => React.ReactElement | null;

(Section as React.FC).displayName = 'Section';
