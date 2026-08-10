import { useEffect } from 'react';

export interface UseOutsideInteractionOptions {
  active: boolean;
  refs: Array<React.RefObject<HTMLElement | null>>;
  onOutsideInteraction: () => void;
}

export const useOutsideInteraction = ({
  active,
  refs,
  onOutsideInteraction,
}: UseOutsideInteractionOptions) => {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isInside = refs.some((ref) => {
        return ref.current && ref.current.contains(target);
      });

      if (!isInside) {
        onOutsideInteraction();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [active, refs, onOutsideInteraction]);
};
