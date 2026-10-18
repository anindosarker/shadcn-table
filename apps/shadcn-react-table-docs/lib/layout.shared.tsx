import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import { ThemeControls } from '@/components/theme-controls';
import { gitConfig } from './shared';

/** Top bar links, shared by the fumadocs layouts and components/site-nav.tsx. */
export const NAV_LINKS = [
  { text: 'Docs', url: '/docs/getting-started/install' },
  { text: 'API', url: '/docs/api' },
  { text: 'Examples', url: '/docs/examples' },
  { text: 'Guides', url: '/docs/guides' },
] as const;

export const GITHUB_URL = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: NAV_LINKS.map((l) => ({ ...l, active: 'nested-url' as const })),
    githubUrl: GITHUB_URL,
    slots: { themeSwitch: ThemeControls },
  };
}
