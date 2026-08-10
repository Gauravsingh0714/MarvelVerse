import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

export interface UseFocusTrapOptions {
  active: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
}

export const useFocusTrap = ({
  active,
  initialFocusRef,
  containerRef,
}: UseFocusTrapOptions) => {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    previousActiveElementRef.current =
      document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Initial focus placement
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          container.focus();
        }
      }
    }, 16);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const currentContainer = containerRef.current;
      if (!currentContainer) return;

      const focusables = Array.from(
        currentContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (
          document.activeElement === firstElement ||
          document.activeElement === currentContainer
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previous active element if still in DOM
      const prevEl = previousActiveElementRef.current;
      if (
        prevEl &&
        typeof prevEl.focus === 'function' &&
        document.body.contains(prevEl)
      ) {
        prevEl.focus();
      }
    };
  }, [active, containerRef, initialFocusRef]);
};
