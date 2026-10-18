import type { ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export function MapSidebar({ open, children }: { open: boolean; children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <m.aside className="am-sidebar" id="architecture-sidebar" aria-label="架构说明" aria-hidden={!open} inert={!open}
    initial={false} animate={{ x: open ? 0 : 'calc(100% + 24px)', opacity: open ? 1 : 0, visibility: 'visible',
      transitionEnd: { visibility: open ? 'visible' : 'hidden' } }}
    transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}>
    {children}
  </m.aside>;
}
