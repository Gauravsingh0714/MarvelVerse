import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Portal } from '../infrastructure/Portal';
import { ToastItem, ToastData } from './Toast';

export type ToastPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const placementClasses: Record<ToastPlacement, string> = {
  'top-left': 'top-4 left-4 flex-col-reverse',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 flex-col-reverse',
  'top-right': 'top-4 right-4 flex-col-reverse',
  'bottom-left': 'bottom-4 left-4 flex-col',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 flex-col',
  'bottom-right': 'bottom-4 right-4 flex-col',
};

export interface ToastContextValue {
  toast: (options: Omit<ToastData, 'id'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined
);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
};

let toastCount = 0;

export interface ToastProviderProps {
  children: React.ReactNode;
  placement?: ToastPlacement;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  placement = 'bottom-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback(
    (options: Omit<ToastData, 'id'> & { id?: string }): string => {
      const id = options.id || `toast-${Date.now()}-${++toastCount}`;

      setToasts((prev) => {
        // Prevent duplicate IDs
        const filtered = prev.filter((item) => item.id !== id);
        const nextToasts = [...filtered, { ...options, id }];
        if (nextToasts.length > maxToasts) {
          return nextToasts.slice(nextToasts.length - maxToasts);
        }
        return nextToasts;
      });

      return id;
    },
    [maxToasts]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, clearToasts }}>
      {children}
      <Portal>
        <div
          role="region"
          aria-label="Notifications"
          className={cn(
            'fixed z-toast pointer-events-none flex gap-2.5 max-w-full p-4',
            placementClasses[placement]
          )}
        >
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem {...t} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
