import { useState, useEffect, useCallback } from 'react';
import { breakpoints } from '../../../design/tokens/primitives/breakpoints';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const breakpointValues: Record<BreakpointKey, number> = {
  xs: parseInt(breakpoints.xs, 10),
  sm: parseInt(breakpoints.sm, 10),
  md: parseInt(breakpoints.md, 10),
  lg: parseInt(breakpoints.lg, 10),
  xl: parseInt(breakpoints.xl, 10),
  '2xl': parseInt(breakpoints['2xl'], 10),
  '3xl': parseInt(breakpoints['3xl'], 10),
};

const breakpointOrder: BreakpointKey[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
];

export interface UseBreakpointReturn {
  activeBreakpoint: BreakpointKey;
  up: (bp: BreakpointKey) => boolean;
  down: (bp: BreakpointKey) => boolean;
  between: (bpMin: BreakpointKey, bpMax: BreakpointKey) => boolean;
  isAtLeast: (bp: BreakpointKey) => boolean;
  isAtMost: (bp: BreakpointKey) => boolean;
}

export const useBreakpoint = (): UseBreakpointReturn => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointKey>('md');

  const calculateActiveBreakpoint = useCallback((): BreakpointKey => {
    if (typeof window === 'undefined') return 'md';
    const width = window.innerWidth;

    if (width >= breakpointValues['3xl']) return '3xl';
    if (width >= breakpointValues['2xl']) return '2xl';
    if (width >= breakpointValues.xl) return 'xl';
    if (width >= breakpointValues.lg) return 'lg';
    if (width >= breakpointValues.md) return 'md';
    if (width >= breakpointValues.sm) return 'sm';
    return 'xs';
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setActiveBreakpoint(calculateActiveBreakpoint());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateActiveBreakpoint]);

  const up = useCallback(
    (bp: BreakpointKey): boolean => {
      const currentIndex = breakpointOrder.indexOf(activeBreakpoint);
      const targetIndex = breakpointOrder.indexOf(bp);
      return currentIndex >= targetIndex;
    },
    [activeBreakpoint]
  );

  const down = useCallback(
    (bp: BreakpointKey): boolean => {
      const currentIndex = breakpointOrder.indexOf(activeBreakpoint);
      const targetIndex = breakpointOrder.indexOf(bp);
      return currentIndex < targetIndex;
    },
    [activeBreakpoint]
  );

  const between = useCallback(
    (bpMin: BreakpointKey, bpMax: BreakpointKey): boolean => {
      const currentIndex = breakpointOrder.indexOf(activeBreakpoint);
      const minIndex = breakpointOrder.indexOf(bpMin);
      const maxIndex = breakpointOrder.indexOf(bpMax);
      return currentIndex >= minIndex && currentIndex <= maxIndex;
    },
    [activeBreakpoint]
  );

  return {
    activeBreakpoint,
    up,
    down,
    between,
    isAtLeast: up,
    isAtMost: down,
  };
};
