import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';
import { LayoutGap } from '../Stack/Stack';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridMode = 'grid' | 'auto-fit' | 'auto-fill';

export interface ResponsiveGridCols {
  xs?: GridCols;
  sm?: GridCols;
  md?: GridCols;
  lg?: GridCols;
  xl?: GridCols;
  '2xl'?: GridCols;
}

export interface GridOwnProps {
  cols?: GridCols | ResponsiveGridCols;
  mode?: GridMode;
  gap?: LayoutGap;
  minColWidth?: string;
  equalHeight?: boolean;
  className?: string;
}

export type GridProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, GridOwnProps>;

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

const colVariants: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const smColVariants: Record<GridCols, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  12: 'sm:grid-cols-12',
};

const mdColVariants: Record<GridCols, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const lgColVariants: Record<GridCols, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const xlColVariants: Record<GridCols, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  12: 'xl:grid-cols-12',
};

export const Grid = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      cols = 1,
      mode = 'grid',
      gap = '6',
      minColWidth,
      equalHeight = false,
      className,
      style,
      children,
      ...props
    }: GridProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';

    let gridColClasses = '';
    let customStyle = style;

    if (mode === 'auto-fit' || mode === 'auto-fill' || minColWidth) {
      const minWidth = minColWidth || '280px';
      const autoMode = mode === 'auto-fill' ? 'auto-fill' : 'auto-fit';
      customStyle = {
        gridTemplateColumns: `repeat(${autoMode}, minmax(${minWidth}, 1fr))`,
        ...style,
      };
    } else if (typeof cols === 'number') {
      gridColClasses = colVariants[cols] || 'grid-cols-1';
    } else if (typeof cols === 'object') {
      const classes: string[] = [];
      if (cols.xs) classes.push(colVariants[cols.xs]);
      if (cols.sm) classes.push(smColVariants[cols.sm]);
      if (cols.md) classes.push(mdColVariants[cols.md]);
      if (cols.lg) classes.push(lgColVariants[cols.lg]);
      if (cols.xl) classes.push(xlColVariants[cols.xl]);
      gridColClasses = classes.join(' ');
    }

    return (
      <Component
        ref={ref}
        style={customStyle}
        className={cn(
          'grid',
          gapVariants[gap],
          gridColClasses,
          equalHeight && 'items-stretch',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
) as <C extends React.ElementType = 'div'>(
  props: GridProps<C>
) => React.ReactElement | null;

(Grid as React.FC).displayName = 'Grid';
