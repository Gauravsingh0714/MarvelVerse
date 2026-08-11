import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  breadcrumbs?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
}

const PageHeaderRoot = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      breadcrumbs,
      eyebrow,
      title,
      description,
      actions,
      tabs,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 pb-4 border-b border-stroke-subtle mb-6',
          className
        )}
        {...props}
      >
        {breadcrumbs && <div className="pt-1">{breadcrumbs}</div>}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            {eyebrow && (
              <span className="text-[11px] font-semibold text-content-accent uppercase tracking-wider">
                {eyebrow}
              </span>
            )}
            {title && typeof title === 'string' ? (
              <h1 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight truncate">
                {title}
              </h1>
            ) : (
              title
            )}
            {description && typeof description === 'string' ? (
              <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-2xl">
                {description}
              </p>
            ) : (
              description
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3 shrink-0">{actions}</div>
          )}
        </div>

        {children}

        {tabs && <div className="pt-2">{tabs}</div>}
      </div>
    );
  }
);
PageHeaderRoot.displayName = 'PageHeader';

export interface PageHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const PageHeaderTitle = forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'text-xl sm:text-2xl font-bold text-content-primary tracking-tight truncate',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
);
PageHeaderTitle.displayName = 'PageHeader.Title';

export interface PageHeaderDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const PageHeaderDescription = forwardRef<
  HTMLParagraphElement,
  PageHeaderDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs sm:text-sm text-content-secondary leading-relaxed max-w-2xl',
      className
    )}
    {...props}
  >
    {children}
  </p>
));
PageHeaderDescription.displayName = 'PageHeader.Description';

export interface PageHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageHeaderActions = forwardRef<HTMLDivElement, PageHeaderActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 shrink-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);
PageHeaderActions.displayName = 'PageHeader.Actions';

export interface PageHeaderEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {}

const PageHeaderEyebrow = forwardRef<HTMLSpanElement, PageHeaderEyebrowProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'text-[11px] font-semibold text-content-accent uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
PageHeaderEyebrow.displayName = 'PageHeader.Eyebrow';

export const PageHeader = Object.assign(PageHeaderRoot, {
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
  Actions: PageHeaderActions,
  Eyebrow: PageHeaderEyebrow,
});
