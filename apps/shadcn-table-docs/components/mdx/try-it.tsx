import type { ReactNode } from 'react';

/**
 * Quiet steps list for a live example. The page writes `### Try it` in
 * markdown above it, so the heading gets the normal MDX h3, anchor and table
 * of contents entry; this wraps only the muted ordered list below it.
 * Fumadocs prose styles lists with zero-specificity `:where()` rules and sets
 * no colour or size on `li`, so the list inherits the colour and size here,
 * its counters are already muted, and these utilities override the margins.
 * Inline code keeps its prose colour (`--tw-prose-code`), so labels stand out.
 */
export const TryIt = ({ children }: { children: ReactNode }) => (
  <div className="my-4 text-sm text-fd-muted-foreground [&_li]:my-0.5 [&_ol]:my-0">
    {children}
  </div>
);
