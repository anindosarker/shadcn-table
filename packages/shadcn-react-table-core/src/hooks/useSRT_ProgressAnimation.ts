import { useEffect, useState, useRef } from 'react';

// MUI LinearProgress `indeterminate1`: 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395),
// keyframes finish the travel at 60% of the cycle then hold until 100%.
const CYCLE_MS = 2100;
const TRAVEL_FRACTION = 0.6;

const bezierAxis = (p1: number, p2: number, t: number) => {
  const u = 1 - t;
  return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
};

const easeIndeterminate1 = (x: number) => {
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 16; i++) {
    t = (lo + hi) / 2;
    if (bezierAxis(0.65, 0.735, t) < x) lo = t;
    else hi = t;
  }
  return bezierAxis(0.815, 0.395, t);
};

export const useSRT_ProgressAnimation = (show: boolean) => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!show) {
      setValue(undefined);
      return;
    }

    startTimeRef.current = null;

    const animate = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsed = now - startTimeRef.current;
      const progress = (elapsed % CYCLE_MS) / CYCLE_MS;

      const easedProgress =
        progress >= TRAVEL_FRACTION
          ? 1
          : easeIndeterminate1(progress / TRAVEL_FRACTION);

      setValue(Math.round(Math.max(0, Math.min(1, easedProgress)) * 100));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [show]);

  return value;
};
