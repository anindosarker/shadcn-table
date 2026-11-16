import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import { ThemeControls } from '@/components/theme-controls';
import { DiscordIcon } from '@/components/discord-icon';
import { gitConfig } from './shared';
import { PREVIEW_SECTIONS } from '@/preview-examples-ab/entries.mjs';

/** Section links, rendered by the sidebar section tabs (components/sidebar-section-tabs.tsx). */
export const NAV_LINKS = [
  { text: 'Docs', url: '/docs/getting-started/introduction' },
  { text: 'Examples', url: '/docs/examples' },
  { text: 'Guides', url: '/docs/guides' },
  { text: 'API', url: '/docs/api' },
] as const;

/** preview-examples-ab: sidebar-only tabs for the two preview Examples sections, linking their first row. Delete with the demo. */
export const PREVIEW_NAV_LINKS = PREVIEW_SECTIONS.map(({ text, url }) => ({
  text,
  url,
}));

export const GITHUB_URL = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
/** Official Discord server: questions and help. */
export const DISCORD_URL = 'https://discord.gg/hsF37t6EKe';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    // No text links: fumadocs renders them as sidebar rows below lg (and in
    // the mobile drawer), duplicating the section tabs (L7) shown there too;
    // the header (components/site-nav.tsx) does not read `links`.
    links: [
      {
        type: 'icon',
        icon: <DiscordIcon />,
        text: 'Discord',
        label: 'Discord',
        url: DISCORD_URL,
        external: true,
      },
    ],
    githubUrl: GITHUB_URL,
    slots: { themeSwitch: ThemeControls },
  };
}
