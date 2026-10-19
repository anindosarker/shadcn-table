'use client';

import type { ReactNode } from 'react';
import { useBase } from '@/components/base-selector';
import type { Base } from '@/lib/install';

/**
 * One Storybook host serves both trees: the Radix build at the root and the
 * Base UI build under /base/ (packages/shadcn-table `storybook:build:base`).
 */
export const storybookUrl: Record<Base, string> = {
  radix: 'https://storybook.shadcn-table.com',
  base: 'https://storybook.shadcn-table.com/base/',
};

/**
 * Link to the Storybook of the selected base. The guide and example pages
 * end with "View Extra Storybook <StorybookLink>Examples</StorybookLink>".
 */
export const StorybookLink = ({ children }: { children?: ReactNode }) => {
  const base = useBase();
  return (
    <a href={storybookUrl[base]} target="_blank" rel="noreferrer">
      {children ?? 'Examples'}
    </a>
  );
};
