'use client';

import { useSyncExternalStore } from 'react';
import { CheckIcon, PaletteIcon, ShuffleIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

/** Random mode: no valid preset stored, so the inline script rolls one per load. */
function getRandomSnapshot(): boolean {
  try {
    return !isThemePreset(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return true;
  }
}

function getServerRandomSnapshot(): boolean {
  return true;
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

/** Forgets the stored pick (random per load again) and rolls a different preset now. */
export function applyRandomThemePreset() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // storage unavailable: only this page re-rolls
  }
  const current = document.documentElement.dataset.theme;
  const others = THEME_PRESETS.filter((p) => p.name !== current);
  document.documentElement.dataset.theme =
    others[Math.floor(Math.random() * others.length)].name;
  for (const l of listeners) l();
}

export function ThemePresetSwitcher({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active =
    THEME_PRESETS.find((p) => p.name === theme) ?? THEME_PRESETS[0];
  const random = useSyncExternalStore(
    subscribe,
    getRandomSnapshot,
    getServerRandomSnapshot,
  );
  const label = random ? `Random (${active.label})` : active.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Theme preset: ${label}`}
        title={`Theme: ${label}`}
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
        <DropdownMenuItem onSelect={applyRandomThemePreset} className="gap-2">
          <ShuffleIcon className="size-3 shrink-0" aria-hidden />
          <span className="flex-1">Random</span>
          {random && <CheckIcon className="size-3.5" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {THEME_PRESETS.map((preset) => (
          <DropdownMenuItem
            key={preset.name}
            onSelect={() => applyThemePreset(preset.name)}
            className="gap-2"
          >
            <Swatch color={preset.swatch} />
            <span className="flex-1">{preset.label}</span>
            {!random && preset.name === theme && (
              <CheckIcon className="size-3.5" />
            )}
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
