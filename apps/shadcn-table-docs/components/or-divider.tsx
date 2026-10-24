import { cn } from '@/lib/cn';

/** A hairline with "or" in the middle, between the agent and manual paths. */
export const OrDivider = ({ className }: { className?: string }) => (
  <div
    role="separator"
    aria-label="or"
    className={cn(
      'not-prose my-6 flex items-center gap-3 text-xs tracking-[0.18em] text-muted-foreground uppercase',
      className,
    )}
  >
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
    or
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
  </div>
);
