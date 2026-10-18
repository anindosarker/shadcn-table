import Link from 'next/link';
import { OutlineTileGrid } from '@/components/dev-home/shared/outline-tiles';
import { InstallCommand } from '@/components/dev-home/shared/install-command';
import { LiveTable } from '@/components/dev-home/shared/live-table';

/** Every shared dev-home piece on one page, for building and reviewing variants. */
export default function DevKitPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16 sm:px-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/dev"
          className="text-sm text-(--dh-ink-muted) hover:text-(--dh-ink)"
        >
          All variants
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Shared kit</h1>
        <InstallCommand className="max-w-2xl" />
        <InstallCommand variant="bare" className="max-w-2xl" />
      </header>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm text-(--dh-ink-muted)">
          OutlineTileGrid size=&quot;lg&quot;
        </h2>
        <OutlineTileGrid size="lg" />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm text-(--dh-ink-muted)">
          OutlineTileGrid size=&quot;md&quot;
        </h2>
        <OutlineTileGrid size="md" />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm text-(--dh-ink-muted)">
          OutlineTileGrid size=&quot;sm&quot; showLabel=false
        </h2>
        <OutlineTileGrid size="sm" showLabel={false} />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-sm text-(--dh-ink-muted)">
          LiveTable example=&quot;advanced&quot;
        </h2>
        <LiveTable example="advanced" caption="Live: the advanced example." />
      </section>
    </main>
  );
}
