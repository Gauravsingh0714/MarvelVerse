export type OverlayType =
  'dialog' | 'alertdialog' | 'popover' | 'dropdown' | 'drawer';

export interface OverlayStackEntry {
  id: string;
  type: OverlayType;
  dismissible: boolean;
  onEscape: () => void;
  priority: number;
}

const stack: OverlayStackEntry[] = [];
let isListenerActive = false;

function handleGlobalKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  if (stack.length === 0) return;

  const topEntry = stack[stack.length - 1];
  if (topEntry.dismissible) {
    event.preventDefault();
    event.stopPropagation();
    topEntry.onEscape();
  }
}

function updateListenerState() {
  if (typeof window === 'undefined') return;

  if (stack.length > 0 && !isListenerActive) {
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    isListenerActive = true;
  } else if (stack.length === 0 && isListenerActive) {
    window.removeEventListener('keydown', handleGlobalKeyDown, true);
    isListenerActive = false;
  }
}

export const registerOverlay = (entry: OverlayStackEntry): (() => void) => {
  const existingIndex = stack.findIndex((item) => item.id === entry.id);
  if (existingIndex !== -1) {
    stack.splice(existingIndex, 1);
  }

  stack.push(entry);
  updateListenerState();

  return () => {
    const index = stack.findIndex((item) => item.id === entry.id);
    if (index !== -1) {
      stack.splice(index, 1);
      updateListenerState();
    }
  };
};

export const getTopmostOverlayId = (): string | null => {
  if (stack.length === 0) return null;
  return stack[stack.length - 1].id;
};
