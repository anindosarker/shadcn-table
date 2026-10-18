import { Table2 } from 'lucide-react';

/** Logo mark + two-weight uppercase wordmark, TanStack style. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-fd-primary text-fd-primary-foreground">
        <Table2 className="size-4" strokeWidth={2.5} />
      </span>
      <span className="inline-flex items-baseline gap-1.5 uppercase tracking-tight">
        <span className="text-lg font-black leading-none text-fd-foreground">
          Shadcn
        </span>
        <span className="text-lg font-bold leading-none text-fd-primary">
          Table
        </span>
      </span>
    </span>
  );
}
