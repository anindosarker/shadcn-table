'use client';

import { useEffect, useRef, type ReactNode } from 'react';
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

/** box-drawing glyph for a junction, keyed by up/down/left/right bits */
const JUNCTION: Record<number, string> = {
  0b0011: '─',
  0b0010: '─',
  0b0001: '─',
  0b1100: '│',
  0b1000: '│',
  0b0100: '│',
  0b0101: '┌',
  0b0110: '┐',
  0b1001: '└',
  0b1010: '┘',
  0b1101: '├',
  0b1110: '┤',
  0b0111: '┬',
  0b1011: '┴',
  0b1111: '┼',
};

interface SettleShowcaseProps {
  children: ReactNode;
  className?: string;
  frameClassName?: string;
}

/**
 * The hero's dune continues into this section as noise. Scrolling in, the
 * noise settles into a clean box-drawing table that sits exactly where the
 * live table is; when it has settled, the real table fades in over it.
 * Reduced motion (or a page loaded past this point) shows the table at once.
 */
export function SettleShowcase({
  children,
  className,
  frameClassName,
}: SettleShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!section || !canvas || !frame) return;

    const reveal = () => {
      section.dataset.revealed = 'true';
      frame.inert = false;
    };
    if (reducedMotion()) {
      reveal();
      return;
    }
    frame.inert = true;

    let atlas: Atlas | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let rnd = new Float32Array(0);
    let gate = new Float32Array(0);
    let seed = new Uint16Array(0);
    /** clean grid: glyph per cell ('' = empty) and its strength */
    let target: string[] = [];
    let weight = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let visible = false;
    let progress = 0;
    let done = false;

    const buildGrid = () => {
      if (!atlas) return;
      const sRect = section.getBoundingClientRect();
      const fRect = frame.getBoundingClientRect();
      const { cw, ch } = atlas;
      const c0 = Math.round((fRect.left - sRect.left) / cw);
      const c1 = Math.min(
        cols - 1,
        Math.round((fRect.right - sRect.left) / cw) - 1,
      );
      const r0 = Math.round((fRect.top - sRect.top) / ch);
      const r1 = Math.min(
        rows - 1,
        Math.round((fRect.bottom - sRect.top) / ch) - 1,
      );
      target = new Array(cols * rows).fill('');
      weight = new Float32Array(cols * rows);
      if (c1 - c0 < 8 || r1 - r0 < 8) return;

      // toolbar, header, body rows every 3, footer: a table's silhouette
      const rTool = r0 + 3;
      const rHead = rTool + 3;
      const rFoot = r1 - 3;
      const major = new Set([r0, rTool, rHead, rFoot, r1]);
      const hRows = new Set(major);
      for (let r = rHead + 3; r < rFoot - 1; r += 3) hRows.add(r);
      const span = c1 - c0;
      const innerCols = (
        span > 70
          ? [0.06, 0.26, 0.46, 0.64, 0.82]
          : span > 36
            ? [0.12, 0.42, 0.7]
            : [0.5]
      ).map((f) => c0 + Math.round(f * span));

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const onH = hRows.has(r);
          const outerV = c === c0 || c === c1;
          const innerV = innerCols.includes(c) && r >= rTool && r <= rFoot;
          const onV = outerV || innerV;
          if (!onH && !onV) continue;
          const vTop = outerV ? r0 : rTool;
          const vBot = outerV ? r1 : rFoot;
          const bits =
            (onV && r > vTop ? 8 : 0) |
            (onV && r < vBot ? 4 : 0) |
            (onH && c > c0 ? 2 : 0) |
            (onH && c < c1 ? 1 : 0);
          const glyph = JUNCTION[bits];
          if (!glyph) continue;
          const i = r * cols + c;
          target[i] = glyph;
          weight[i] = major.has(r) || outerV ? 0.95 : 0.4;
        }
      }
    };

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fitted = fitCanvas(canvas, dpr);
      ({ w, h, ctx } = fitted);
      atlas = buildAtlas(
        getComputedStyle(canvas).fontFamily,
        13,
        resolveColor(canvas, 'var(--dh-accent)'),
        dpr,
      );
      cols = Math.ceil(w / atlas.cw);
      rows = Math.ceil(h / atlas.ch);
      const n = cols * rows;
      rnd = new Float32Array(n);
      gate = new Float32Array(n);
      seed = new Uint16Array(n);
      for (let i = 0; i < n; i++) {
        rnd[i] = Math.random();
        gate[i] = Math.random();
        seed[i] = (Math.random() * 997) | 0;
      }
      buildGrid();
    };

    const measure = () => {
      const vh = window.innerHeight;
      const sTop = section.getBoundingClientRect().top;
      const fTop = frame.getBoundingClientRect().top;
      const offset = fTop - sTop;
      return clamp01((vh - sTop) / (vh * 0.72 + offset));
    };

    const draw = () => {
      if (!ctx || !atlas) return;
      const p = progress;
      const fade = Math.pow(1 - p, 1.4);
      const dense = Math.max(320, window.innerHeight * 0.6);
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        const y = r * atlas.ch;
        // the dune is densest where the hero left off and thins downward
        const d = 0.9 * clamp01(1 - y / dense);
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * atlas.cw;
          const t = target[i];
          if (t) {
            // each grid cell locks in at its own moment, top rows first
            const at = 0.12 + 0.6 * gate[i] + 0.18 * (r / rows);
            if (p >= at) {
              stamp(ctx, atlas, t, x, y, weight[i] * clamp01((p - at) * 8));
              continue;
            }
            stamp(ctx, atlas, pick(RAMP.mid, seed[i]), x, y, 0.45 * (1 - p));
            continue;
          }
          const chance = (0.03 + 0.97 * Math.pow(d, 0.7)) * fade;
          if (rnd[i] >= chance) continue;
          const ramp = d > 0.7 ? RAMP.dense : d > 0.35 ? RAMP.mid : RAMP.light;
          stamp(
            ctx,
            atlas,
            pick(ramp, seed[i]),
            x,
            y,
            (0.16 + 0.7 * d * d) * (0.35 + 0.65 * fade),
          );
        }
      }
      ctx.globalAlpha = 1;
    };

    const finish = () => {
      done = true;
      progress = 1;
      draw();
      reveal();
      stop();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const p = measure();
      const moved = Math.abs(p - progress) > 0.001;
      progress = p;
      if (p >= 0.995) {
        finish();
        return;
      }
      if (!moved && now - last < 90) return;
      last = now;
      const k = Math.max(1, (rnd.length * 0.03) | 0);
      for (let j = 0; j < k; j++) {
        const i = (Math.random() * rnd.length) | 0;
        rnd[i] = Math.random();
        seed[i] = (Math.random() * 997) | 0;
      }
      draw();
    };

    const start = () => {
      if (done || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    progress = measure();
    if (progress >= 0.995) {
      finish();
      return;
    }
    draw();

    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive || done) return;
      setup();
      draw();
    });

    // the live table changes height as it loads: re-fit the grid to it
    const ro = new ResizeObserver(() => {
      if (done) return;
      setup();
      draw();
    });
    ro.observe(section);
    ro.observe(frame);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(section);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      alive = false;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Live example"
      className={cn('v4-settle relative', className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="v4-canvas v4-settle-canvas pointer-events-none absolute inset-0 size-full"
      />
      <div className={cn('v4-shell relative', frameClassName)}>
        <div ref={frameRef} className="v4-settle-frame">
          {children}
        </div>
      </div>
    </section>
  );
}
