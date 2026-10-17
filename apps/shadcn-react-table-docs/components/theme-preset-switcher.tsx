'use client';

import { useSyncExternalStore } from 'react';
import { CheckIcon, PaletteIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';
import {
  DEFAULT_THEME,
  isThemePreset,
  THEME_PRESETS,
  THEME_STORAGE_KEY,
  type ThemePreset,
} from '@/lib/theme-presets';

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Current preset: the attribute the inline script set, never React state at hydration. */
function getSnapshot(): ThemePreset {
  const current = document.documentElement.dataset.theme;
  return isThemePreset(current) ? current : DEFAULT_THEME;
}

function getServerSnapshot(): ThemePreset {
  return DEFAULT_THEME;
}

export function applyThemePreset(name: ThemePreset) {
  document.documentElement.dataset.theme = name;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, name);
  } catch {
    // storage unavailable (private mode): the attribute still applies for this page
  }
  for (const l of listeners) l();
}

export function ThemePresetSwitcher({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active =
    THEME_PRESETS.find((p) => p.name === theme) ?? THEME_PRESETS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Theme preset: ${active.label}`}
        title={`Theme: ${active.label}`}
        className={cn(
          'inline-flex size-6.5 items-center justify-center rounded-full transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent',
          className,
        )}
      >
        <PaletteIcon
          className="size-4"
          style={{ color: active.swatch }}
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {THEME_PRESETS.map((preset) => (
          <DropdownMenuItem
            key={preset.name}
            onSelect={() => applyThemePreset(preset.name)}
            className="gap-2"
          >
            <Swatch color={preset.swatch} />
            <span className="flex-1">{preset.label}</span>
            {preset.name === theme && <CheckIcon className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-3 shrink-0 rounded-full border border-fd-foreground/20"
      style={{ backgroundColor: color }}
    />
  );
}
