import { cn } from '@/lib/cn';

/** Rows the skeleton table shows under its header band. */
const ROWS = 8;

/**
 * Loading shape of a live example's table area: a search and actions row
 * above a table with a header band and eight rows. The playground's preview
 * shows it while the example's chunk loads (components/example-variant.tsx).
 */
export function ExampleTableSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading example"
      className={cn('animate-pulse space-y-3', className)}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-56 rounded-md bg-muted" />
        <div className="ml-auto h-8 w-24 rounded-md bg-muted" />
      </div>
      <div className="overflow-hidden rounded-md border">
        <div className="h-10 bg-muted" />
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} className="flex h-10 items-center gap-4 border-t px-3">
            <div className="h-3 w-1/4 rounded bg-muted" />
            <div className="h-3 w-1/5 rounded bg-muted" />
            <div className="ml-auto h-3 w-1/12 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
