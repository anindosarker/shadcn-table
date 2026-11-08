'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';
import type { ThemeSwitchProps } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import {
  ThemeCustomizer,
  ThemeCustomizerTrigger,
} from '@/components/theme-customizer';
import { Sheet, SheetTrigger } from '@/components/ui-radix/sheet';

/**
 * `slots.themeSwitch` for the fumadocs layouts: one pill with the palette
 * button, which opens the theme customizer, and a single light/dark toggle, in
 * the nav on desktop and in the sidebar footer on mobile.
 */
export function ThemeControls(_props: ThemeSwitchProps) {
  return (
    <Sheet>
      <div className="inline-flex items-center gap-0.5 rounded-full border p-1">
        <SheetTrigger asChild>
          <ThemeCustomizerTrigger />
        </SheetTrigger>
        <ModeToggle />
      </div>
      <ThemeCustomizer />
    </Sheet>
  );
}

/** Shows the current mode's icon (sun in light, moon in dark) and flips it.
 * The icon is chosen by the `.dark` class, so the server and client agree. */
function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle light or dark mode"
      title="Light / dark mode"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex size-6.5 items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <SunIcon className="size-4 dark:hidden" aria-hidden />
      <MoonIcon className="hidden size-4 dark:block" aria-hidden />
    </button>
  );
}
