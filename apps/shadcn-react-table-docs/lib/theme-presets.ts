/** Theme presets: one entry per themes/<name>.css, shared by the inline script
 * in app/layout.tsx (server) and the switcher (client). The swatch is the
 * dark-mode primary of the preset. */
export const THEME_PRESETS = [
  { name: 'mono', label: 'Mono', swatch: 'oklch(0.708 0 0)' },
  { name: 'violet', label: 'Violet', swatch: 'oklch(0.702 0.183 293.541)' },
  { name: 'blue', label: 'Blue', swatch: 'oklch(0.546 0.245 262.881)' },
  { name: 'emerald', label: 'Emerald', swatch: 'oklch(0.765 0.177 163.223)' },
  { name: 'rose', label: 'Rose', swatch: 'oklch(0.712 0.194 13.428)' },
  { name: 'amber', label: 'Amber', swatch: 'oklch(0.828 0.189 84.429)' },
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number]['name'];

/** localStorage key read by the inline script before first paint. */
export const THEME_STORAGE_KEY = 'srt-theme';
export const DEFAULT_THEME: ThemePreset = 'violet';
/** No saved pick: roll a random preset on each load (not persisted) instead of DEFAULT_THEME. */
export const RANDOMIZE_DEFAULT_THEME = true;

export function isThemePreset(
  value: string | null | undefined,
): value is ThemePreset {
  return THEME_PRESETS.some((p) => p.name === value);
}
