import { themes, type ThemeVars } from 'storybook/theming';

/**
 * Every edition, in the order of scripts/registry/lib.mjs `EDITIONS` and of
 * the `storybook dev` ports in package.json (6006, 6007, 6008). Static
 * builds sit side by side: radix at the root, every other edition under
 * <edition>/ (`storybook:build:<edition>`).
 */
export const EDITIONS = ['radix', 'base', 'aria'] as const;
export type Edition = (typeof EDITIONS)[number];

export const EDITION_LABELS: Record<Edition, string> = {
  radix: 'Radix UI',
  base: 'Base UI',
  aria: 'React Aria',
};

/**
 * The edition this Storybook was built for, set on the window by main.ts
 * (`managerHead` / `previewHead`) from ST_BASE. Radix when unset.
 */
export const ST_BASE: Edition =
  EDITIONS.find(
    (edition) =>
      edition === (globalThis as { __ST_BASE__?: string }).__ST_BASE__,
  ) ?? 'radix';

export const ST_BASE_LABEL = EDITION_LABELS[ST_BASE];

/** The other editions, the ones the manager's edition buttons open. */
export const ST_OTHER_EDITIONS = EDITIONS.filter(
  (edition) => edition !== ST_BASE,
);

/**
 * Relative URL of another edition's static build from this one: the root
 * holds radix, <edition>/ every other edition.
 */
export function staticEditionRoot(target: Edition) {
  const root = ST_BASE === 'radix' ? './' : '../';
  return target === 'radix' ? root : `${root}${target}/`;
}

/**
 * Whether this manager runs under `storybook dev` (set by main.ts on the
 * window from the build's config type). Static builds leave it false.
 */
export const ST_DEV: boolean =
  (globalThis as { __ST_DEV__?: boolean }).__ST_DEV__ === true;

/** Manager title: "shadcn-table (Radix UI)", "(Base UI)" or "(React Aria)". */
const brandTitle = `shadcn-table (${ST_BASE_LABEL})`;

/**
 * Shared manager/docs themes. The dark surfaces match the shadcn `.dark`
 * `--background` (oklch(0.145 0 0) ~ #252525) so the manager chrome, the docs
 * page and the table all read as one surface, like material-react-table.dev.
 */
export const darkTheme: ThemeVars = {
  ...themes.dark,
  brandTitle,
  appBg: '#252525',
  appContentBg: '#252525',
  appPreviewBg: '#252525',
  barBg: '#252525',
};

export const lightTheme: ThemeVars = { ...themes.light, brandTitle };

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
