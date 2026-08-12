import React from 'react';
import { Spinner } from '../../components/ui/Spinner/Spinner';
import { Surface } from '../../components/ui/Surface/Surface';

export interface RouteLoadingProps {
  label?: string;
}

export const RouteLoading: React.FC<RouteLoadingProps> = ({
  label = 'Loading page content...',
}) => {
  return (
    <Surface
      role="status"
      aria-label="Page loading"
      elevation="none"
      border="subtle"
      className="w-full min-h-[300px] flex flex-col items-center justify-center p-8 gap-4 rounded-lg"
    >
      <Spinner size="lg" />
      <span className="text-xs font-medium text-content-secondary animate-pulse select-none">
        {label}
      </span>
    </Surface>
  );
};

RouteLoading.displayName = 'RouteLoading';
