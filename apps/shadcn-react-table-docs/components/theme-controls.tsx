'use client';

import {
  ThemeSwitch,
  type ThemeSwitchProps,
} from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { ThemePresetSwitcher } from '@/components/theme-preset-switcher';

/**
 * `slots.themeSwitch` for the fumadocs layouts: the preset dropdown next to the
 * light/dark toggle, in the nav on desktop and in the sidebar footer on mobile.
 */
export function ThemeControls(props: ThemeSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <ThemePresetSwitcher />
      <ThemeSwitch {...props} />
    </div>
  );
}
