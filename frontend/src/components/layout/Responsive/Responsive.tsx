import React from 'react';
import { cn } from '../../../utils/cn';
import { BreakpointKey } from '../hooks/useBreakpoint';

export interface ResponsiveProps {
  above?: BreakpointKey;
  below?: BreakpointKey;
  only?: BreakpointKey;
  className?: string;
  children: React.ReactNode;
}

const aboveVariants: Record<BreakpointKey, string> = {
  xs: 'hidden',
  sm: 'hidden sm:block',
  md: 'hidden md:block',
  lg: 'hidden lg:block',
  xl: 'hidden xl:block',
  '2xl': 'hidden 2xl:block',
  '3xl': 'hidden 3xl:block',
};

const belowVariants: Record<BreakpointKey, string> = {
  xs: 'block xs:hidden',
  sm: 'block sm:hidden',
  md: 'block md:hidden',
  lg: 'block lg:hidden',
  xl: 'block xl:hidden',
  '2xl': 'block 2xl:hidden',
  '3xl': 'block 3xl:hidden',
};

const onlyVariants: Record<BreakpointKey, string> = {
  xs: 'block sm:hidden',
  sm: 'hidden sm:block md:hidden',
  md: 'hidden md:block lg:hidden',
  lg: 'hidden lg:block xl:hidden',
  xl: 'hidden xl:block 2xl:hidden',
  '2xl': 'hidden 2xl:block 3xl:hidden',
  '3xl': 'hidden 3xl:block',
};

export const Responsive: React.FC<ResponsiveProps> = ({
  above,
  below,
  only,
  className,
  children,
}) => {
  let responsiveClass = '';

  if (above) {
    responsiveClass = aboveVariants[above];
  } else if (below) {
    responsiveClass = belowVariants[below];
  } else if (only) {
    responsiveClass = onlyVariants[only];
  }

  return <div className={cn(responsiveClass, className)}>{children}</div>;
};

Responsive.displayName = 'Responsive';
