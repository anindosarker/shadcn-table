import { cn } from '@/lib/cn';

/** Rows the skeleton table shows under its header band. */
const ROWS = 8;

/**
 * Loading shape of a live example's table area: a search and actions row
 * above a table with a header band and eight rows. The playground's preview
 * shows it while the example's chunk loads (components/example-variant.tsx),
 * and ExampleSkeleton shows it under its toolbar.
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

/**
 * Loading shape of an example block: the playground's toolbar (example tabs,
 * base pill, view mode and action buttons) above ExampleTableSkeleton.
 * Reserves the same `min-h-[560px]` as LazyMount's placeholder, so the page
 * does not jump when the real block replaces it. Server-renderable: used as
 * the Suspense fallback of an eager block, as LazyMount's placeholder and as
 * LazyBlock's placeholder until the body arrives.
 */
export function ExampleSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('not-prose min-h-[560px] py-8', className)}
    >
      <div className="animate-pulse overflow-hidden rounded-lg border">
        <div className="flex min-h-12 flex-wrap items-center gap-2 px-3 py-1.5">
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="h-8 w-20 rounded-md bg-muted" />
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-40 rounded-md bg-muted" />
            <div className="h-8 w-28 rounded-md bg-muted" />
          </div>
        </div>
        <ExampleTableSkeleton className="p-4" />
      </div>
    </div>
  );
}
