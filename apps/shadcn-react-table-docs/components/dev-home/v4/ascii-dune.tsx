'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import {
  RAMP,
  buildAtlas,
  clamp01,
  fitCanvas,
  pick,
  reducedMotion,
  resolveColor,
  stamp,
  type Atlas,
} from './field';

interface AsciiDuneProps {
  className?: string;
  /** false: densest at the bottom (hero). true: densest at the top (footer). */
  flip?: boolean;
  /** Ticks per second for the shuffle. */
  fps?: number;
  fontSize?: number;
}

/**
 * A drifting dune of box-drawing glyphs on a canvas. Dense at one edge,
 * thinning to dust at the other. A few percent of cells re-roll each tick;
 * the dune line drifts slowly. Static under reduced motion; paused offscreen.
 */
export function AsciiDune({
  className,
  flip = false,
  fps = 11,
  fontSize = 13,
}: AsciiDuneProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const still = reducedMotion();

    let atlas: Atlas | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let rnd = new Float32Array(0);
    let seed = new Uint16Array(0);
    let raf = 0;
    let last = 0;
    let visible = false;
    const t0 = performance.now();

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fitted = fitCanvas(canvas, dpr);
      ({ w, h, ctx } = fitted);
      const style = getComputedStyle(canvas);
      atlas = buildAtlas(
        style.fontFamily,
        fontSize,
        resolveColor(canvas, 'var(--dh-accent)'),
        dpr,
      );
      cols = Math.ceil(w / atlas.cw);
      rows = Math.ceil(h / atlas.ch);
      rnd = new Float32Array(cols * rows);
      seed = new Uint16Array(cols * rows);
      for (let i = 0; i < rnd.length; i++) {
        rnd[i] = Math.random();
        seed[i] = (Math.random() * 997) | 0;
      }
    };

    /** where the dune surface sits in column c, as a 0..1 fraction from the sparse edge */
    const surface = (c: number, t: number) =>
      0.34 +
      0.14 * Math.sin(c * 0.045 + t * 0.00011) +
      0.08 * Math.sin(c * 0.017 - t * 0.00006 + 1.3) +
      0.04 * Math.sin(c * 0.19 + t * 0.00031);

    const draw = (t: number) => {
      if (!ctx || !atlas) return;
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        const f0 = (r + 0.5) / rows;
        const f = flip ? 1 - f0 : f0;
        const y = r * atlas.ch;
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const s = surface(c, t);
          const d = clamp01((f - s) / (1 - s));
          const x = c * atlas.cw;
          if (d <= 0) {
            if (rnd[i] < 0.012) stamp(ctx, atlas, '·', x, y, 0.4);
            continue;
          }
          if (rnd[i] > 0.06 + 0.84 * Math.pow(d, 0.55)) continue;
          const ramp =
            d > 0.72
              ? RAMP.dense
              : d > 0.42
                ? RAMP.mid
                : d > 0.16
                  ? RAMP.light
                  : RAMP.dust;
          stamp(ctx, atlas, pick(ramp, seed[i]), x, y, 0.16 + 0.7 * d * d);
        }
      }
      ctx.globalAlpha = 1;
    };

    const shuffle = () => {
      const n = Math.max(1, (rnd.length * 0.03) | 0);
      for (let k = 0; k < n; k++) {
        const i = (Math.random() * rnd.length) | 0;
        rnd[i] = Math.random();
        seed[i] = (Math.random() * 997) | 0;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / fps) return;
      last = now;
      shuffle();
      draw(now - t0);
    };

    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    draw(0);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      setup();
      draw(performance.now() - t0);
    });

    const ro = new ResizeObserver(() => {
      setup();
      draw(performance.now() - t0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      alive = false;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [flip, fps, fontSize]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn('v4-canvas block w-full', className)}
    />
  );
}
