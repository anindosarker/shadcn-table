import { useEffect, useState, useRef } from 'react';

export type SRT_ProgressAnimationStrategy =
  | 'ease-in-out'
  | 'ease-in'
  | 'ease-out'
  | 'linear'
  | 'bounce'
  | 'elastic'
  | 'pulse';

export interface SRT_ProgressAnimationOptions {
  duration?: number;
  strategy?: SRT_ProgressAnimationStrategy;
  minValue?: number;
  maxValue?: number;
}

export const useSRT_ProgressAnimation = (
  show: boolean,
  options: SRT_ProgressAnimationOptions = {},
) => {
  const {
    duration = 2000,
    strategy = 'ease-in-out',
    minValue = 0,
    maxValue = 100,
  } = options;
  const [value, setValue] = useState<number | undefined>(undefined);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const easingFunctions = {
    'ease-in-out': (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => 1 - Math.pow(1 - t, 2),
    linear: (t: number) => t,
    bounce: (t: number) => {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    elastic: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const c4 = (2 * Math.PI) / 3;
      return Math.pow(2, -10 * t) * Math.sin((t * 5 - 0.75) * c4) + 1;
    },
    pulse: (t: number) => {
      const pulse = Math.sin(t * Math.PI * 4) * 0.05 * (1 - t);
      return Math.max(0, Math.min(1, t + pulse));
    },
  };

  useEffect(() => {
    if (!show) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setValue(undefined);
      return;
    }

    setValue(minValue);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = (elapsed % duration) / duration;

      let easedProgress = easingFunctions[strategy](progress);

      if (progress >= 0.95) {
        easedProgress = 1;
      } else if (
        progress >= 0.85 &&
        ['bounce', 'elastic', 'pulse'].includes(strategy)
      ) {
        easedProgress = 1;
      } else {
        easedProgress = Math.max(0, Math.min(1, easedProgress));
      }

      const newValue = Math.round(
        minValue + easedProgress * (maxValue - minValue),
      );

      setValue(newValue);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [show, duration, strategy, minValue, maxValue]);

  return [value, setValue] as const;
};
