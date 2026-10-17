import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import { ThemeControls } from '@/components/theme-controls';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    links: [
      {
        text: 'Get Started',
        url: '/docs/getting-started/install',
        active: 'nested-url',
      },
      { text: 'API', url: '/docs/api', active: 'nested-url' },
      { text: 'Examples', url: '/docs/examples', active: 'nested-url' },
      { text: 'Guides', url: '/docs/guides', active: 'nested-url' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    slots: { themeSwitch: ThemeControls },
  };
}
