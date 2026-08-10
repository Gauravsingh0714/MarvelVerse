import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

export const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = getScrollbarWidth();
      if (scrollbarWidth > 0) {
        const computedPadding = window.getComputedStyle(
          document.body
        ).paddingRight;
        const currentPaddingNum = parseFloat(computedPadding) || 0;
        document.body.style.paddingRight = `${currentPaddingNum + scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    }

    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [active]);
};
