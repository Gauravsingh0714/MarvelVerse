import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { LayoutGap } from '../Stack/Stack';

export type SpacerAxis = 'vertical' | 'horizontal';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LayoutGap;
  axis?: SpacerAxis;
  className?: string;
}

const heightVariants: Record<LayoutGap, string> = {
  '0': 'h-0',
  '05': 'h-0.5',
  '1': 'h-1',
  '2': 'h-2',
  '3': 'h-3',
  '4': 'h-4',
  '6': 'h-6',
  '8': 'h-8',
  '12': 'h-12',
  '16': 'h-16',
  '24': 'h-24',
  '32': 'h-32',
};

const widthVariants: Record<LayoutGap, string> = {
  '0': 'w-0',
  '05': 'w-0.5',
  '1': 'w-1',
  '2': 'w-2',
  '3': 'w-3',
  '4': 'w-4',
  '6': 'w-6',
  '8': 'w-8',
  '12': 'w-12',
  '16': 'w-16',
  '24': 'w-24',
  '32': 'w-32',
};

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = '4', axis = 'vertical', className, ...props }, ref) => {
    const isVertical = axis === 'vertical';

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          isVertical
            ? ['w-full', heightVariants[size]]
            : ['inline-block', widthVariants[size]],
          'shrink-0',
          className
        )}
        {...props}
      />
    );
  }
);

Spacer.displayName = 'Spacer';
