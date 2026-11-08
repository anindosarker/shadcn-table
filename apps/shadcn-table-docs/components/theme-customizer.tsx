'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useFormatForDisplay } from '@tanstack/react-hotkeys';
import {
  CheckIcon,
  CopyIcon,
  MoonIcon,
  PaletteIcon,
  Redo2Icon,
  RotateCcwIcon,
  ShuffleIcon,
  SunIcon,
  Undo2Icon,
  UploadIcon,
} from 'lucide-react';
import {
  THEME_HOTKEYS,
  useDesignSystem,
} from '@/components/design-system-provider';
import { Button } from '@/components/ui-radix/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-radix/dropdown-menu';
import { Input } from '@/components/ui-radix/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui-radix/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-radix/select';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui-radix/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui-radix/tabs';
import { cn } from '@/lib/cn';
import {
  COLOR_PRESETS,
  findColorPreset,
  type ColorPreset,
} from '@/lib/design-system/color-presets';
import {
  BASE_COLORS,
  buildThemeCss,
  buildThemeVars,
  encodeConfig,
  FONTS,
  getThemesForBaseColor,
  MENU_ACCENTS,
  MENU_COLORS,
  RADII,
  STYLES,
  type DesignSystemConfig,
} from '@/lib/design-system/config';
import {
  isColorValue,
  TOKENS,
  type Mode,
  type Token,
} from '@/lib/design-system/tokens';

/** The palette button in the nav pill; a `SheetTrigger` child that opens the
 * customizer. */
export function ThemeCustomizerTrigger({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label="Customize theme"
      title="Customize theme"
      className={cn(
        'inline-flex size-6.5 items-center justify-center rounded-full transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent',
        className,
      )}
      {...props}
    >
      <PaletteIcon className="size-4 text-primary" aria-hidden />
    </button>
  );
}

const FONT_GROUPS = [
  { label: 'Sans', fonts: FONTS.filter((f) => /sans-serif$/.test(f.family)) },
  { label: 'Mono', fonts: FONTS.filter((f) => /monospace$/.test(f.family)) },
  { label: 'Serif', fonts: FONTS.filter((f) => / serif$/.test(f.family)) },
];

/** The customizer panel (D2): a right-side sheet, rendered inside the `Sheet`
 * that ThemeControls owns. */
export function ThemeCustomizer() {
  const { config, setConfig, reset, shuffle, undo, redo, canUndo, canRedo } =
    useDesignSystem();
  const { resolvedTheme, setTheme } = useTheme();
  const mode: Mode = resolvedTheme === 'light' ? 'light' : 'dark';
  const format = useFormatForDisplay();
  const themes = getThemesForBaseColor(config.baseColor);
  const radiusLocked = config.style === 'lyra' || config.style === 'sera';

  return (
    <SheetContent
      side="right"
      className="w-[360px] gap-0 overflow-y-auto p-0 data-[side=right]:sm:max-w-[360px]"
    >
      <SheetHeader className="flex-row items-center gap-2 border-b py-3 pr-12">
        <SheetTitle className="flex-1">Theme</SheetTitle>
        <SheetDescription className="sr-only">
          Colors, fonts and radius of the docs site, saved in this browser for
          two days.
        </SheetDescription>
        <Kbd>{format(THEME_HOTKEYS.reset)}</Kbd>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reset theme"
          title={`Reset (${format(THEME_HOTKEYS.reset)})`}
          onClick={reset}
        >
          <RotateCcwIcon />
        </Button>
      </SheetHeader>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-1">
          <CopyMenu config={config} />
          <Button
            variant="outline"
            size="sm"
            disabled={!canUndo}
            onClick={undo}
          >
            <Undo2Icon data-icon="inline-start" />
            Undo
            <Kbd>{format(THEME_HOTKEYS.undo)}</Kbd>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canRedo}
            onClick={redo}
          >
            <Redo2Icon data-icon="inline-start" />
            Redo
          </Button>
        </div>

        <Section label="Mode">
          <div
            role="group"
            aria-label="Mode"
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-[3px]"
          >
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setTheme(m)}
                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
              >
                {m === 'light' ? (
                  <SunIcon className="size-3.5" aria-hidden />
                ) : (
                  <MoonIcon className="size-3.5" aria-hidden />
                )}
                {m === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
          <SelectField
            label="Style"
            value={config.style}
            onChange={(style) =>
              setConfig({ style: style as DesignSystemConfig['style'] })
            }
          >
            {STYLES.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.title}
              </SelectItem>
            ))}
          </SelectField>
          <SelectField
            label="Icon Library"
            value="lucide"
            disabled
            onChange={() => {}}
          >
            <SelectItem value="lucide">Lucide</SelectItem>
          </SelectField>
          {/* A color preset replaces the base color, theme and chart tokens, so
              picking one of these leaves the preset. */}
          <SelectField
            label="Base Color"
            value={config.baseColor}
            onChange={(baseColor) =>
              setConfig({ baseColor, colorPreset: 'none' })
            }
          >
            {BASE_COLORS.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.title}
              </SelectItem>
            ))}
          </SelectField>
          <SelectField
            label="Theme"
            value={config.theme}
            onChange={(theme) => setConfig({ theme, colorPreset: 'none' })}
          >
            {themes.map((t) => (
              <SelectItem key={t.name} value={t.name}>
                {t.title}
              </SelectItem>
            ))}
          </SelectField>
          <SelectField
            label="Menu Color"
            value={config.menuColor}
            onChange={(menuColor) =>
              setConfig({
                menuColor: menuColor as DesignSystemConfig['menuColor'],
              })
            }
          >
            {MENU_COLORS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.title}
              </SelectItem>
            ))}
          </SelectField>
          <SelectField
            label="Menu Accent"
            value={config.menuAccent}
            onChange={(menuAccent) =>
              setConfig({
                menuAccent: menuAccent as DesignSystemConfig['menuAccent'],
              })
            }
          >
            {MENU_ACCENTS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.title}
              </SelectItem>
            ))}
          </SelectField>
        </div>

        <Section label="Presets">
          <div className="flex items-center gap-1">
            <ImportPreset />
            <Button
              variant="outline"
              size="sm"
              title={`Random (${format(THEME_HOTKEYS.shuffle)})`}
              onClick={shuffle}
            >
              <ShuffleIcon data-icon="inline-start" />
              Random
              <Kbd>{format(THEME_HOTKEYS.shuffle)}</Kbd>
            </Button>
          </div>
          <ColorPresetSelect
            value={config.colorPreset}
            onChange={(colorPreset) => setConfig({ colorPreset })}
          />
          <p className="text-xs text-muted-foreground">
            <Kbd>{format(THEME_HOTKEYS.shuffleColorPreset)}</Kbd> picks another
            color preset.
          </p>
        </Section>

        <Tabs defaultValue="colors">
          <TabsList className="w-full">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="colors">
            <ColorsTab mode={mode} />
          </TabsContent>
          <TabsContent value="typography" className="flex flex-col gap-3">
            <SelectField
              label="Font"
              value={config.font}
              onChange={(font) =>
                setConfig({ font: font as DesignSystemConfig['font'] })
              }
            >
              <FontOptions />
            </SelectField>
            <SelectField
              label="Heading font"
              value={config.fontHeading}
              onChange={(fontHeading) =>
                setConfig({
                  fontHeading: fontHeading as DesignSystemConfig['fontHeading'],
                })
              }
            >
              <SelectItem value="inherit">Inherit</SelectItem>
              <FontOptions />
            </SelectField>
          </TabsContent>
          <TabsContent value="other" className="flex flex-col gap-3">
            <SelectField
              label="Radius"
              value={config.radius}
              disabled={radiusLocked}
              onChange={(radius) =>
                setConfig({ radius: radius as DesignSystemConfig['radius'] })
              }
            >
              {RADII.filter(
                (r) => config.style !== 'rhea' || r.name !== 'large',
              ).map((r) => (
                <SelectItem key={r.name} value={r.name}>
                  {r.title}
                </SelectItem>
              ))}
            </SelectField>
            <SelectField
              label="Chart color"
              value={config.chartColor}
              onChange={(chartColor) =>
                setConfig({ chartColor, colorPreset: 'none' })
              }
            >
              {themes.map((t) => (
                <SelectItem key={t.name} value={t.name}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectField>
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ms-1 rounded border bg-muted px-1 font-sans text-[0.7rem] leading-4 text-muted-foreground">
      {children}
    </kbd>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} size="sm" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-80">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}

function FontOptions() {
  return FONT_GROUPS.map((group) => (
    <SelectGroup key={group.label}>
      <SelectLabel>{group.label}</SelectLabel>
      {group.fonts.map((f) => (
        <SelectItem key={f.value} value={f.value}>
          {f.title}
        </SelectItem>
      ))}
    </SelectGroup>
  ));
}

/** Default first, then the tweakcn palettes, each with its swatch. Off a preset
 * (base color and theme picked by hand) the trigger reads Custom. */
function ColorPresetSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const preset = findColorPreset(value);
  return (
    <Select value={preset ? value : ''} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label="Color preset" className="w-full">
        <SelectValue placeholder="Custom (base color and theme)" />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-80">
        {COLOR_PRESETS.map((p) => (
          <SelectItem key={p.name} value={p.name}>
            <ColorPresetLabel preset={p} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ColorPresetLabel({ preset }: { preset: ColorPreset }) {
  return (
    <span className="flex items-center gap-2">
      <Swatch tokens={preset.light} className="dark:hidden" />
      <Swatch tokens={preset.dark} className="hidden dark:flex" />
      {preset.label}
    </span>
  );
}

function Swatch({
  tokens,
  className,
}: {
  tokens: Record<string, string>;
  className?: string;
}) {
  return (
    <span className={cn('flex -space-x-1', className)} aria-hidden>
      {(['primary', 'accent', 'background'] as const).map((key) => (
        <span
          key={key}
          className="size-3 rounded-full border border-foreground/20"
          style={{ backgroundColor: tokens[key] }}
        />
      ))}
    </span>
  );
}

/** Copy the theme CSS or the create preset code. */
function CopyMenu({ config }: { config: DesignSystemConfig }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: nothing to show
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="docs-menu">
        <DropdownMenuItem onSelect={() => copy(buildThemeCss(config))}>
          Copy CSS
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copy(encodeConfig(config))}>
          Copy preset code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Paste a create preset code (ui.shadcn.com/create, `shadcn init --preset`). */
function ImportPreset() {
  const { importPreset } = useDesignSystem();
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [error, setError] = React.useState(false);

  const apply = () => {
    if (!importPreset(draft)) {
      setError(true);
      return;
    }
    setDraft('');
    setError(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <UploadIcon data-icon="inline-start" />
          Import
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <label htmlFor={id} className="text-xs font-medium">
          Preset code
        </label>
        <div className="flex gap-1">
          <Input
            id={id}
            value={draft}
            spellCheck={false}
            placeholder="b2fms620zo"
            aria-invalid={error || undefined}
            onChange={(event) => {
              setDraft(event.target.value);
              setError(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') apply();
            }}
            className="h-7"
          />
          <Button size="sm" onClick={apply} disabled={!draft.trim()}>
            Apply
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive">Not a preset code.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** One row per token for the current mode; a valid color applies at once. */
function ColorsTab({ mode }: { mode: Mode }) {
  const { config, setConfig, setToken } = useDesignSystem();
  const vars = buildThemeVars(config)[mode];
  const edited = Object.keys(config.overrides[mode]).length > 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {mode === 'light' ? 'Light' : 'Dark'} mode tokens
        </p>
        <button
          type="button"
          disabled={!edited}
          onClick={() =>
            setConfig({ overrides: { ...config.overrides, [mode]: {} } })
          }
          className="text-xs text-primary underline-offset-2 hover:underline disabled:pointer-events-none disabled:opacity-50"
        >
          Reset colors
        </button>
      </div>
      {TOKENS.map((token) => (
        <TokenRow
          key={`${mode}-${token}`}
          token={token}
          value={vars[token] ?? ''}
          onChange={(value) => setToken(mode, token, value)}
        />
      ))}
    </div>
  );
}

function TokenRow({
  token,
  value,
  onChange,
}: {
  token: Token;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = React.useId();
  // What the reader is typing; null shows the applied value.
  const [draft, setDraft] = React.useState<string | null>(null);
  const shown = draft ?? value;
  const valid = draft === null || isColorValue(draft);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_11rem] items-center gap-2">
      <label htmlFor={id} className="truncate font-mono text-xs">
        {token}
      </label>
      <span
        aria-hidden
        className={cn(
          'size-5 rounded border border-foreground/20',
          !valid && 'bg-muted',
        )}
        style={valid ? { backgroundColor: shown } : undefined}
      />
      <Input
        id={id}
        value={shown}
        spellCheck={false}
        aria-invalid={!valid || undefined}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (isColorValue(next)) onChange(next.trim());
        }}
        onBlur={() => setDraft(null)}
        className="h-7 font-mono text-xs"
      />
    </div>
  );
}
