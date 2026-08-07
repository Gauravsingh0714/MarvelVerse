import { useState, useEffect } from 'react';

export interface UseViewportReturn {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

export const useViewport = (): UseViewportReturn => {
  const [viewport, setViewport] = useState<UseViewportReturn>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1280,
        height: 800,
        isPortrait: false,
        isLandscape: true,
      };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
      isPortrait: height > width,
      isLandscape: width >= height,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        const width = window.innerWidth;
        const height = window.innerHeight;
        setViewport({
          width,
          height,
          isPortrait: height > width,
          isLandscape: width >= height,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
};
