import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const resizeTransition = 'width 150ms ease-out, height 150ms ease-out';

interface Size {
  height: number;
  width: number;
}

/**
 * Glides a popup between its natural sizes when `step` changes, such as a
 * column list that swaps to a value editor in place. The first render of a
 * newly mounted popup and every change under reduced motion resize at once.
 * Pass the returned callback as the popup element's `ref`.
 */
export const useST_PopupResize = (step: string) => {
  const popupRef = useRef<HTMLElement | null>(null);
  // State only so the effects re-run when a new popup element mounts.
  const [mountedPopup, setMountedPopup] = useState<HTMLElement | null>(null);
  const sizeRef = useRef<Size | null>(null);
  const animatingRef = useRef(false);
  const stepRef = useRef(step);

  useLayoutEffect(() => {
    sizeRef.current = null;
    const popup = popupRef.current;
    if (!popup) return;
    const record = () => {
      if (animatingRef.current) return;
      sizeRef.current = {
        height: popup.offsetHeight,
        width: popup.offsetWidth,
      };
    };
    record();
    const observer = new ResizeObserver(record);
    observer.observe(popup);
    return () => observer.disconnect();
  }, [mountedPopup]);

  useLayoutEffect(() => {
    if (stepRef.current === step) return;
    stepRef.current = step;
    const from = sizeRef.current;
    const popup = popupRef.current;
    if (!popup || !from) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { style } = popup;
    const to = { height: popup.offsetHeight, width: popup.offsetWidth };
    if (to.width === from.width && to.height === from.height) return;

    let active = true;
    const settle = () => {
      if (!active) return;
      active = false;
      // Read before clearing: a step change mid-glide starts from here.
      sizeRef.current = {
        height: popup.offsetHeight,
        width: popup.offsetWidth,
      };
      style.removeProperty('transition');
      style.removeProperty('width');
      style.removeProperty('height');
      style.removeProperty('overflow');
      animatingRef.current = false;
    };

    animatingRef.current = true;
    style.overflow = 'hidden';
    style.width = `${from.width}px`;
    style.height = `${from.height}px`;
    // Reading layout commits the start size before the transition is set.
    void popup.offsetWidth;
    style.transition = resizeTransition;
    style.width = `${to.width}px`;
    style.height = `${to.height}px`;

    const transitions = popup
      .getAnimations()
      .filter((animation) => animation instanceof CSSTransition);
    Promise.all(transitions.map((animation) => animation.finished)).then(
      settle,
      // A newer step cancelled this transition; its cleanup already settled.
      () => {},
    );
    return settle;
  }, [mountedPopup, step]);

  return useCallback((node: HTMLElement | null) => {
    popupRef.current = node;
    setMountedPopup(node);
  }, []);
};
