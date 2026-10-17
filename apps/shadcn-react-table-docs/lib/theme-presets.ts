/** Theme presets: one entry per themes/<name>.css, shared by the inline script
 * in app/layout.tsx (server) and the switcher (client). The swatch is the
 * dark-mode primary of the preset. */
export const THEME_PRESETS = [
  { name: 'violet', label: 'Violet', swatch: 'oklch(0.702 0.183 293.541)' },
  { name: 'zinc', label: 'Zinc', swatch: 'oklch(0.705 0.015 286.067)' },
  { name: 'emerald', label: 'Emerald', swatch: 'oklch(0.765 0.177 163.223)' },
  { name: 'rose', label: 'Rose', swatch: 'oklch(0.712 0.194 13.428)' },
  { name: 'amber', label: 'Amber', swatch: 'oklch(0.828 0.189 84.429)' },
  { name: 'mono', label: 'Mono', swatch: 'oklch(0.708 0 0)' },
] as const;

export type ThemePreset = (typeof THEME_PRESETS)[number]['name'];

/** localStorage key read by the inline script before first paint. */
export const THEME_STORAGE_KEY = 'srt-theme';
export const DEFAULT_THEME: ThemePreset = 'violet';

export function isThemePreset(
  value: string | null | undefined,
): value is ThemePreset {
  return THEME_PRESETS.some((p) => p.name === value);
}
