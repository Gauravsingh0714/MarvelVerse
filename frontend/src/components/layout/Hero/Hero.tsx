import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '../../../types/polymorphic';
import { Container } from '../Container/Container';

export type HeroHeight = 'auto' | 'compact' | 'cinematic' | 'full';

export interface HeroOwnProps {
  height?: HeroHeight;
  constrained?: boolean;
  backgroundSlot?: React.ReactNode;
  className?: string;
}

export type HeroProps<C extends React.ElementType = 'section'> =
  PolymorphicComponentPropsWithRef<C, HeroOwnProps>;

const heightVariants: Record<HeroHeight, string> = {
  auto: 'min-h-0 py-16',
  compact: 'min-h-[50vh] py-20',
  cinematic: 'min-h-[80vh] py-24',
  full: 'min-h-screen py-32',
};

export const Hero = forwardRef(
  <C extends React.ElementType = 'section'>(
    {
      as,
      height = 'cinematic',
      constrained = true,
      backgroundSlot,
      className,
      children,
      ...props
    }: HeroProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'section';

    const contentNode = constrained ? (
      <Container size="2xl">{children}</Container>
    ) : (
      children
    );

    return (
      <Component
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden flex items-center justify-center',
          heightVariants[height],
          className
        )}
        {...props}
      >
        {backgroundSlot && (
          <div className="absolute inset-0 z-deep pointer-events-none overflow-hidden">
            {backgroundSlot}
          </div>
        )}
        <div className="relative z-base w-full">{contentNode}</div>
      </Component>
    );
  }
) as <C extends React.ElementType = 'section'>(
  props: HeroProps<C>
) => React.ReactElement | null;

(Hero as React.FC).displayName = 'Hero';
