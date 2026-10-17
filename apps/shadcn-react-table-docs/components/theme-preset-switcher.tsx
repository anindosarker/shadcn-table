'use client';

import { useSyncExternalStore } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
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
        aria-label="Theme preset"
        className={cn(
          'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[0.8rem] text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground',
          className,
        )}
      >
        <Swatch color={active.swatch} />
        <span>{active.label}</span>
        <ChevronDownIcon className="size-3.5 opacity-70" />
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
