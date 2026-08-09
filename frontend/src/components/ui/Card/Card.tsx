import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Surface, SurfaceProps } from '../Surface/Surface';

export interface CardProps extends Omit<SurfaceProps<'div'>, 'as'> {
  interactive?: boolean;
}

const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className, children, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        variant="raised"
        border="subtle"
        elevation="md"
        className={cn(
          'overflow-hidden flex flex-col',
          interactive &&
            'cursor-pointer hover:shadow-lg hover:border-stroke-focus transition-all duration-150 active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {children}
      </Surface>
    );
  }
);

CardComponent.displayName = 'Card';

/* -------------------------------------------------------------------------- */
/*                               Card Subcomponents                           */
/* -------------------------------------------------------------------------- */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ bordered = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-5 flex items-center justify-between',
          bordered && 'border-b border-stroke-subtle',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'Card.Header';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ noPadding = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1', !noPadding && 'p-5', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardBody.displayName = 'Card.Body';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ bordered = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-5 flex items-center justify-between mt-auto',
          bordered && 'border-t border-stroke-subtle',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
