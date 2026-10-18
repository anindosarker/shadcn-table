/*
 * Box-drawing field helpers shared by the hero dune, the settle showcase and
 * the footer strip. Glyphs are rendered once into an atlas canvas (device
 * pixel ratio aware) and stamped with drawImage + globalAlpha, which is far
 * cheaper than fillText per cell.
 */

/** Glyph ramps, densest first. */
export const RAMP = {
  dense: ['┼', '├', '┤', '┬', '┴', '─', '│', '┼'],
  mid: ['┌', '┐', '└', '┘', '─', '│', '╎'],
  light: ['╎', '┆', ':', '─', '·'],
  dust: ['·', ':', '·'],
} as const;

/** Every glyph the fields can draw, including the clean grid set. */
export const ALL_GLYPHS = Array.from(
  new Set([...RAMP.dense, ...RAMP.mid, ...RAMP.light, ...RAMP.dust, '└', '┘']),
);

export interface Atlas {
  canvas: HTMLCanvasElement;
  index: Map<string, number>;
  /** cell size in CSS px */
  cw: number;
  ch: number;
  /** atlas slot size in device px */
  sw: number;
  sh: number;
  dpr: number;
}

/** Resolve any CSS colour (oklch, var) to an rgb() string canvas accepts. */
export function resolveColor(el: HTMLElement, cssColor: string): string {
  const probe = document.createElement('span');
  probe.style.color = cssColor;
  probe.style.display = 'none';
  el.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return computed;
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

export function buildAtlas(
  fontFamily: string,
  fontSize: number,
  color: string,
  dpr: number,
): Atlas {
  const measure = document.createElement('canvas').getContext('2d');
  const font = `${fontSize}px ${fontFamily}`;
  let cw = fontSize * 0.6;
  if (measure) {
    measure.font = font;
    cw = measure.measureText('─').width || cw;
  }
  const ch = Math.round(fontSize * 1.3);
  const sw = Math.ceil(cw * dpr) + 1;
  const sh = Math.ceil(ch * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = sw * ALL_GLYPHS.length;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');
  const index = new Map<string, number>();
  if (ctx) {
    ctx.font = `${fontSize * dpr}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ALL_GLYPHS.forEach((g, i) => {
      ctx.fillText(g, i * sw, sh / 2);
      index.set(g, i);
    });
  }
  return { canvas, index, cw, ch, sw, sh, dpr };
}

export function stamp(
  ctx: CanvasRenderingContext2D,
  atlas: Atlas,
  glyph: string,
  x: number,
  y: number,
  alpha: number,
) {
  const i = atlas.index.get(glyph);
  if (i === undefined || alpha <= 0.01) return;
  ctx.globalAlpha = alpha > 1 ? 1 : alpha;
  ctx.drawImage(
    atlas.canvas,
    i * atlas.sw,
    0,
    atlas.sw,
    atlas.sh,
    x,
    y,
    atlas.sw / atlas.dpr,
    atlas.sh / atlas.dpr,
  );
}

/** Size a canvas backing store to its CSS box; returns the CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement, dpr: number) {
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, ctx };
}

export function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const pick = <T>(list: readonly T[], seed: number) =>
  list[seed % list.length];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
