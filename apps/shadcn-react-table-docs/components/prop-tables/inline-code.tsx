import type { ReactNode } from 'react';

/** Type / default value cell: inline code without the prose styling. */
export const InlineCode = ({ children }: { children: ReactNode }) =>
  children ? (
    <code className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.8rem] whitespace-pre-wrap">
      {children}
    </code>
  ) : null;
