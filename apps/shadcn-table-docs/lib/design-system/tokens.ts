/** The color tokens the theme CSS emits per mode, in the order of the shadcn
 * token set (the Colors tab lists them in this order). */
export const TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;

export type Token = (typeof TOKENS)[number];

export type Mode = 'light' | 'dark';

/** Per-mode token values that replace what the preset and theme give. */
export type TokenOverrides = Record<Mode, Partial<Record<Token, string>>>;

export const EMPTY_OVERRIDES: TokenOverrides = { light: {}, dark: {} };

export function isToken(value: unknown): value is Token {
  return (TOKENS as readonly unknown[]).includes(value);
}

/** True when the browser parses `value` as a color (checked with CSS.supports,
 * so oklch, hex, rgb and named colors all pass). */
export function isColorValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /[;{}]/.test(trimmed)) return false;
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('color', trimmed);
}

const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const hexCache = new Map<string, string>();
let hexCanvas: CanvasRenderingContext2D | null | undefined;

/** `value` as a `#rrggbb` hex for the color picker. Hex passes through; any
 * other color is resolved by the browser (painted on a 1x1 canvas and read
 * back, since a computed style keeps oklch as oklch). Client only: without a
 * document, or for a value the browser cannot parse, it returns `#000000`.
 * Alpha is dropped. */
export function toHex(value: string) {
  const trimmed = value.trim();
  if (HEX.test(trimmed)) return trimmed;
  const cached = hexCache.get(trimmed);
  if (cached) return cached;
  if (typeof document === 'undefined' || !isColorValue(trimmed)) {
    return '#000000';
  }
  if (hexCanvas === undefined) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    hexCanvas = canvas.getContext('2d', { willReadFrequently: true });
  }
  if (!hexCanvas) return '#000000';
  hexCanvas.clearRect(0, 0, 1, 1);
  hexCanvas.fillStyle = '#000000';
  hexCanvas.fillStyle = trimmed;
  hexCanvas.fillRect(0, 0, 1, 1);
  const [r, g, b] = hexCanvas.getImageData(0, 0, 1, 1).data;
  const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  hexCache.set(trimmed, hex);
  return hex;
}

/** Keeps only known tokens with string values, for both modes. */
export function normalizeOverrides(input: unknown): TokenOverrides {
  const result: TokenOverrides = { light: {}, dark: {} };
  if (!input || typeof input !== 'object') return result;
  for (const mode of ['light', 'dark'] as const) {
    const values = (input as Record<string, unknown>)[mode];
    if (!values || typeof values !== 'object') continue;
    for (const [key, value] of Object.entries(values)) {
      if (isToken(key) && typeof value === 'string' && !/[;{}]/.test(value)) {
        result[mode][key] = value;
      }
    }
  }
  return result;
}
