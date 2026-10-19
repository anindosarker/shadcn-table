import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import { ThemeControls } from '@/components/theme-controls';
import { DiscordIcon } from '@/components/discord-icon';
import { gitConfig } from './shared';

/** Top bar links, shared by the fumadocs layouts and components/site-nav.tsx. */
export const NAV_LINKS = [
  { text: 'Docs', url: '/docs/getting-started/install' },
  { text: 'API', url: '/docs/api' },
  { text: 'Examples', url: '/docs/examples' },
  { text: 'Guides', url: '/docs/guides' },
] as const;

export const GITHUB_URL = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
/** Official Discord server: questions and help. */
export const DISCORD_URL = 'https://discord.gg/ya4dwaDqD';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: [
      ...NAV_LINKS.map((l) => ({ ...l, active: 'nested-url' as const })),
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
