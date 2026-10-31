import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface ST_MenuAnchorOptions {
  /** The element the menu opens from; `null` while closed. */
  anchorEl: HTMLElement | null;
  /** Sets or clears the anchor; the hook calls it on open, close and toggle. */
  setAnchorEl: (anchor: HTMLElement | null) => void;
}

export interface ST_MenuAnchor {
  /** Menu root `onOpenChange`: clears the anchor on close. */
  readonly onOpenChange: (open: boolean) => void;
  /** Opener click handler: closes when open from this anchor, opens otherwise. */
  readonly toggle: (anchor: HTMLElement) => void;
  /** The anchor's box this render, re-measured on resize and scroll while open; `undefined` while closed. */
  readonly rect: DOMRect | undefined;
  /** Spread on the visible opener: aria-haspopup, aria-expanded, onClick toggle. */
  readonly openerProps: {
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    onClick: (event: MouseEvent<HTMLElement>) => void;
  };
  /** Spread on the invisible trigger span: fixed box over the anchor, hidden from the tree. */
  readonly spanProps: {
    style: CSSProperties;
    'aria-hidden': true;
    tabIndex: -1;
    inert: true;
  };
  /** Focuses the last anchor the menu opened from, read through a ref. */
  readonly focusAnchor: () => void;
}

/**
 * Menus open from an invisible span placed over the anchor, not from a button.
 * The menu restores focus after the anchor is cleared, so the last anchor is
 * kept in a ref and focused instead of the invisible trigger.
 */
export const useST_MenuAnchor = ({
  anchorEl,
  setAnchorEl,
}: ST_MenuAnchorOptions): ST_MenuAnchor => {
  const lastAnchorRef = useRef<HTMLElement | null>(null);
  const [measured, setMeasured] = useState<{
    anchor: HTMLElement | null;
    rect: DOMRect | undefined;
  }>({ anchor: null, rect: undefined });

  if (measured.anchor !== anchorEl) {
    setMeasured({ anchor: anchorEl, rect: anchorEl?.getBoundingClientRect() });
  }

  useEffect(() => {
    if (!anchorEl) return;
    lastAnchorRef.current = anchorEl;
    const measure = () =>
      setMeasured({ anchor: anchorEl, rect: anchorEl.getBoundingClientRect() });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [anchorEl]);

  const rect = measured.anchor === anchorEl ? measured.rect : undefined;

  const toggle = (anchor: HTMLElement) => {
    if (anchorEl === anchor) {
      setAnchorEl(null);
      return;
    }
    lastAnchorRef.current = anchor;
    setAnchorEl(anchor);
  };

  return {
    onOpenChange: (open) => {
      if (!open) setAnchorEl(null);
    },
    toggle,
    rect,
    openerProps: {
      'aria-haspopup': 'menu',
      'aria-expanded': !!anchorEl,
      onClick: (event) => toggle(event.currentTarget),
    },
    spanProps: {
      style: {
        position: 'fixed',
        left: rect?.left ?? 0,
        top: rect?.top ?? 0,
        width: rect?.width ?? 0,
        height: rect?.height ?? 0,
        pointerEvents: 'none',
      },
      'aria-hidden': true,
      tabIndex: -1,
      inert: true,
    },
    focusAnchor: () => lastAnchorRef.current?.focus(),
  };
};
