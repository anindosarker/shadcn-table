import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen } from 'lucide-react';
import { Logo } from '@/components/logo';
import { gitConfig, storybookUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        type: 'icon',
        label: 'Storybook',
        icon: <BookOpen />,
        text: 'Storybook',
        url: storybookUrl,
        external: true,
      },
    ],
  };
}
