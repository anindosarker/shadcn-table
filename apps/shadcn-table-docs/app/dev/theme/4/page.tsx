import type { Metadata } from 'next';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import { ThemeGrid } from '@/components/theme-demo/variants/grid';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

export const metadata: Metadata = { title: 'Theme demo: grid' };

/** Variant 4: three themes side by side. */
export default function Page() {
  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main className="v4-shell flex w-full flex-col gap-4 py-12">
        <h1 className="text-2xl font-semibold">One table, any theme</h1>
        <ThemeGrid />
      </main>
    </div>
  );
}
