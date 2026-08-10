import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const OVERLAY_ROOT_ID = 'marvelverse-overlay-root';

function getOrCreateOverlayRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null;

  let root = document.getElementById(OVERLAY_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = OVERLAY_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
}

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement | null;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const targetNode = container || getOrCreateOverlayRoot();
    setMountNode(targetNode);
  }, [container]);

  if (!mountNode) return null;

  return createPortal(children, mountNode) as unknown as React.ReactElement;
};

Portal.displayName = 'Portal';
