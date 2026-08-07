import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';
import { LayoutGap, LayoutAlign, LayoutJustify } from '../Stack/Stack';

export interface InlineOwnProps {
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  wrap?: boolean;
  className?: string;
}

export type InlineProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, InlineOwnProps>;

const gapVariants: Record<LayoutGap, string> = {
  '0': 'gap-0',
  '05': 'gap-0.5',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '12': 'gap-12',
  '16': 'gap-16',
  '24': 'gap-24',
  '32': 'gap-32',
};

const alignVariants: Record<LayoutAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyVariants: Record<LayoutJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Inline = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      gap = '4',
      align = 'center',
      justify = 'start',
      wrap = true,
      className,
      children,
      ...props
    }: InlineProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          'flex flex-row',
          wrap ? 'flex-wrap' : 'flex-nowrap',
          gapVariants[gap],
          alignVariants[align],
          justifyVariants[justify],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'div'>(
  props: InlineProps<C>
) => React.ReactElement | null;

(Inline as React.FC).displayName = 'Inline';
