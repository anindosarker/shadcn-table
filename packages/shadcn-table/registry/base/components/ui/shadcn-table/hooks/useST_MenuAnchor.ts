import {
  type CSSProperties,
  type MouseEvent,
  type RefObject,
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
  /** The last anchor the menu opened from; kept after close for focus return. */
  readonly anchorRef: RefObject<HTMLElement | null>;
}

/**
 * Menus open from an invisible span placed over the anchor, not from a button.
 * The menu restores focus after the anchor is cleared, so the last anchor is
 * kept in a ref and focused instead of the invisible trigger. A press on the
 * open menu's opener closes it as an outside press before the opener's click
 * arrives, so that click must not open the menu again.
 */
export const useST_MenuAnchor = ({
  anchorEl,
  setAnchorEl,
}: ST_MenuAnchorOptions): ST_MenuAnchor => {
  const lastAnchorRef = useRef<HTMLElement | null>(null);
  // The anchor a press landed on while its menu was open, until the next press.
  const pressedAnchorRef = useRef<HTMLElement | null>(null);
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
    const notePress = (event: PointerEvent) => {
      pressedAnchorRef.current =
        event.target instanceof Node && anchorEl.contains(event.target)
          ? anchorEl
          : null;
    };
    const forgetPress = () => {
      pressedAnchorRef.current = null;
    };
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    document.addEventListener('pointerdown', notePress, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      document.removeEventListener('pointerdown', notePress, true);
      // Added during the closing press, so only the next press runs it.
      document.addEventListener('pointerdown', forgetPress, {
        capture: true,
        once: true,
      });
    };
  }, [anchorEl]);

  const rect = measured.anchor === anchorEl ? measured.rect : undefined;

  const toggle = (anchor: HTMLElement) => {
    const pressedWhileOpen = pressedAnchorRef.current === anchor;
    pressedAnchorRef.current = null;
    if (anchorEl === anchor) {
      setAnchorEl(null);
      return;
    }
    if (pressedWhileOpen) return;
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
    anchorRef: lastAnchorRef,
  };
};
