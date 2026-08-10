import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number; // ms, default 4000, 0 for persistent
}

export interface ToastItemProps extends ToastData {
  onDismiss: (id: string) => void;
  className?: string;
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  info: (
    <Info className="w-4 h-4 text-statusInfo shrink-0" aria-hidden="true" />
  ),
  success: (
    <CheckCircle2
      className="w-4 h-4 text-statusSuccess shrink-0"
      aria-hidden="true"
    />
  ),
  warning: (
    <AlertTriangle
      className="w-4 h-4 text-statusWarning shrink-0"
      aria-hidden="true"
    />
  ),
  error: (
    <AlertCircle
      className="w-4 h-4 text-statusError shrink-0"
      aria-hidden="true"
    />
  ),
};

const variantBorderClasses: Record<ToastVariant, string> = {
  info: 'border-l-4 border-l-statusInfo',
  success: 'border-l-4 border-l-statusSuccess',
  warning: 'border-l-4 border-l-statusWarning',
  error: 'border-l-4 border-l-statusError',
};

export const ToastItem: React.FC<ToastItemProps> = ({
  id,
  title,
  description,
  variant = 'info',
  duration = 4000,
  onDismiss,
  className,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);
  const [isPaused, setIsPaused] = useState(false);

  const pauseTimer = useCallback(() => {
    if (duration <= 0 || isPaused) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    setIsPaused(true);
  }, [duration, isPaused]);

  const resumeTimer = useCallback(() => {
    if (duration <= 0 || !isPaused || remainingRef.current <= 0) return;
    setIsPaused(false);
  }, [duration, isPaused]);

  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(id);
    }, remainingRef.current);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, id, isPaused, onDismiss]);

  const isAssertive = variant === 'error';

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? 'assertive' : 'polite'}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onFocus={pauseTimer}
      onBlur={resumeTimer}
      className={cn(
        'relative w-full max-w-sm p-4 bg-surface text-content-primary rounded-md border border-stroke-subtle shadow-lg flex items-start gap-3 transition-all duration-250 ease-cinematic',
        variantBorderClasses[variant],
        className
      )}
    >
      {variantIcons[variant]}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <h4 className="text-xs font-semibold text-content-primary leading-snug">
          {title}
        </h4>
        {description && (
          <p className="text-[11px] text-content-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-content-secondary hover:text-content-primary p-0.5 rounded transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-stroke-focus focus:outline-none"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
};

ToastItem.displayName = 'ToastItem';
