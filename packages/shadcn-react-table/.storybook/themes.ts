import { themes, type ThemeVars } from 'storybook/theming';

/**
 * Shared manager/docs themes. The dark surfaces match the shadcn `.dark`
 * `--background` (oklch(0.145 0 0) ~ #252525) so the manager chrome, the docs
 * page and the table all read as one surface, like material-react-table.dev.
 */
export const darkTheme: ThemeVars = {
  ...themes.dark,
  appBg: '#252525',
  appContentBg: '#252525',
  appPreviewBg: '#252525',
  barBg: '#252525',
};

export const lightTheme: ThemeVars = themes.light;

/** localStorage key storybook-dark-mode persists the user's choice under. */
export const DARK_MODE_STORAGE_KEY = 'sb-addon-themes-3';

/**
 * Read the persisted storybook-dark-mode choice. Defaults to dark on a fresh
 * browser so the first paint is dark instead of following the OS scheme.
 */
export function readStoredMode(): 'dark' | 'light' {
  try {
    const raw = globalThis.localStorage?.getItem(DARK_MODE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { current?: string };
      if (parsed.current === 'light') return 'light';
    }
  } catch {
    // Ignore unreadable storage and fall through to the default.
  }
  return 'dark';
}
