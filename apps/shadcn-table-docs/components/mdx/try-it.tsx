import type { ReactNode } from 'react';

/**
 * Quiet "Try it" aside above a live example: a small label, not a heading
 * (so it stays out of the table of contents), over a muted ordered list.
 * Fumadocs prose styles lists with zero-specificity `:where()` rules and sets
 * no colour or size on `li`, so the list inherits the colour and size here,
 * its counters are already muted, and these utilities override the margins.
 */
export const TryIt = ({ children }: { children: ReactNode }) => (
  <div className="my-4 text-sm text-fd-muted-foreground [&_li]:my-0.5 [&_ol]:my-0">
    <p className="mt-0 mb-1 font-medium">Try it</p>
    {children}
  </div>
);
