'use client';

import type { ReactNode } from 'react';
import { useBase } from '@/components/base-selector';
import type { Base } from '@/lib/install';
import { trackStorybookOpened } from '@/lib/analytics';

/**
 * One Storybook host serves every tree, each build under its base:
 * /base/, /radix/ and /aria/ (packages/shadcn-table `storybook:build:base`,
 * `storybook:build:radix`, `storybook:build:aria`); the root redirects to
 * /base/.
 */
export const storybookUrl: Record<Base, string> = {
  radix: 'https://storybook.shadcn-table.com/radix/',
  base: 'https://storybook.shadcn-table.com/base/',
  aria: 'https://storybook.shadcn-table.com/aria/',
};

/**
 * Link to the Storybook of the selected base. The guide and example pages
 * end with "View Extra Storybook <StorybookLink>Examples</StorybookLink>".
 */
export const StorybookLink = ({ children }: { children?: ReactNode }) => {
  const base = useBase();
  return (
    <a
      href={storybookUrl[base]}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackStorybookOpened({ base, surface: 'mdx_link' })}
    >
      {children ?? 'Examples'}
    </a>
  );
};
