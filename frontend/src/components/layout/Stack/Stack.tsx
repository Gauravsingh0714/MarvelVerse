import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';

export type LayoutGap =
  '0' | '05' | '1' | '2' | '3' | '4' | '6' | '8' | '12' | '16' | '24' | '32';
export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type LayoutJustify =
  'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackOwnProps {
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  className?: string;
}

export type StackProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, StackOwnProps>;

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

export const Stack = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      gap = '4',
      align = 'stretch',
      justify = 'start',
      className,
      children,
      ...props
    }: StackProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    return (
      <Component
        ref={ref}
        className={cn(
          'flex flex-col',
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
  props: StackProps<C>
) => React.ReactElement | null;

(Stack as React.FC).displayName = 'Stack';
