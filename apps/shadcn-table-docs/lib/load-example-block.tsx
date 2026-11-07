'use server';

import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { ExampleBlockBody } from '@/components/example-block-body';

/** An example slug: lowercase segments, `/` between folder levels. */
const SLUG = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;

/**
 * Renders the body of the example page `/docs/examples/<slug>` for a block
 * of the continuous examples page that scrolled near the viewport. Rejects
 * anything that is not an example page (the examples index included).
 */
export async function loadExampleBlock(slug: string): Promise<ReactNode> {
  if (typeof slug !== 'string' || !SLUG.test(slug)) {
    throw new Error('Not an example page');
  }
  const page = source.getPage(['examples', ...slug.split('/')]);
  if (!page || page.slugs[0] !== 'examples' || page.slugs.length < 2) {
    throw new Error('Not an example page');
  }
  return <ExampleBlockBody page={page} />;
}
