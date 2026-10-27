'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { archivo } from '@/components/dev-home/v4/font';
import { Nav } from '@/components/dev-home/v12/nav';
import type { DemoThemeId } from '@/components/theme-demo/demo-themes';
import { ThemeChips } from '@/components/theme-demo/theme-chips';
import { ThemeScope } from '@/components/theme-demo/theme-scope';
import { useThemeCycle } from '@/components/theme-demo/use-theme-cycle';
import '@/components/dev-home/v4/v4.css';
import '@/components/dev-home/v12/v12.css';

const ThemeTable = dynamic(
  () => import('@/components/theme-demo/theme-table'),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex min-h-[22rem] items-center justify-center text-sm text-muted-foreground"
      >
        Loading table
      </div>
    ),
  },
);

/** Phase 1 harness: chips, then one table in a ThemeScope on autoplay.
 * Variant 1 (terminal) replaces it. */
export default function Page() {
  const { theme, paused, select, resume, ref } = useThemeCycle();
  const [font, setFont] = useState<DemoThemeId>();

  return (
    <div data-variant="12" className={`v4-root v12 ${archivo.variable}`}>
      <Nav />
      <main ref={ref} className="v4-shell flex w-full flex-col gap-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ThemeChips
            value={theme.id}
            onSelect={select}
            showFonts
            font={font}
            onFontSelect={setFont}
          />
          {paused ? (
            <button
              type="button"
              onClick={resume}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Resume autoplay
            </button>
          ) : null}
        </div>
        <ThemeScope
          theme={theme.id}
          font={font}
          className="overflow-hidden rounded-xl border p-3"
        >
          <ThemeTable />
        </ThemeScope>
      </main>
    </div>
  );
}
