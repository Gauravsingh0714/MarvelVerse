export type OverlayPlacement = 'top' | 'bottom' | 'left' | 'right';
export type OverlayAlign = 'start' | 'center' | 'end';

export interface GetOverlayPositionOptions {
  anchorElement: HTMLElement;
  overlayElement: HTMLElement;
  placement?: OverlayPlacement;
  align?: OverlayAlign;
  offset?: number;
}

export interface OverlayPositionResult {
  top: number;
  left: number;
}

/** Stage 1.1 Token Scale Anchors: spacing['3'] = 12px, spacing['2'] = 8px */
const VIEWPORT_PADDING_PX = 12;
const DEFAULT_OFFSET_PX = 8;

export function getOverlayPosition({
  anchorElement,
  overlayElement,
  placement = 'bottom',
  align = 'start',
  offset = DEFAULT_OFFSET_PX,
}: GetOverlayPositionOptions): OverlayPositionResult {
  if (typeof window === 'undefined') return { top: 0, left: 0 };

  const anchorRect = anchorElement.getBoundingClientRect();
  const overlayRect = overlayElement.getBoundingClientRect();

  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  let top = 0;
  let left = 0;

  // Placement (primary axis)
  switch (placement) {
    case 'top':
      top = anchorRect.top + scrollY - overlayRect.height - offset;
      break;
    case 'bottom':
      top = anchorRect.bottom + scrollY + offset;
      break;
    case 'left':
      left = anchorRect.left + scrollX - overlayRect.width - offset;
      break;
    case 'right':
      left = anchorRect.right + scrollX + offset;
      break;
  }

  // Alignment (cross axis)
  if (placement === 'top' || placement === 'bottom') {
    switch (align) {
      case 'start':
        left = anchorRect.left + scrollX;
        break;
      case 'center':
        left =
          anchorRect.left +
          scrollX +
          (anchorRect.width - overlayRect.width) / 2;
        break;
      case 'end':
        left = anchorRect.right + scrollX - overlayRect.width;
        break;
    }
  } else {
    // left or right placement
    switch (align) {
      case 'start':
        top = anchorRect.top + scrollY;
        break;
      case 'center':
        top =
          anchorRect.top +
          scrollY +
          (anchorRect.height - overlayRect.height) / 2;
        break;
      case 'end':
        top = anchorRect.bottom + scrollY - overlayRect.height;
        break;
    }
  }

  // Viewport Clamping (mapped to Stage 1.1 spacing scale)
  const minLeft = scrollX + VIEWPORT_PADDING_PX;
  const maxLeft =
    scrollX + window.innerWidth - overlayRect.width - VIEWPORT_PADDING_PX;
  const minTop = scrollY + VIEWPORT_PADDING_PX;
  const maxTop =
    scrollY + window.innerHeight - overlayRect.height - VIEWPORT_PADDING_PX;

  left = Math.max(minLeft, Math.min(left, maxLeft));
  top = Math.max(minTop, Math.min(top, maxTop));

  return {
    top: Math.round(top),
    left: Math.round(left),
  };
}
