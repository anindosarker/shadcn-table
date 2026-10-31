'use client';

import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui-radix/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui-radix/dropdown-menu';
import { cn } from '@/lib/cn';
import { installableLocales } from '@/lib/locales';

/**
 * Select button for a locale item, the same control as the header's base
 * select (BaseSwitch, components/base-selector.tsx): the selected language and
 * a chevron, opening a scrolling radio menu over the registry's locale items
 * (lib/locales.ts, `en` excluded since it ships with the table).
 */
export const LocaleSwitch = ({
  value,
  onValueChange,
  className,
}: {
  value: string;
  onValueChange: (code: string) => void;
  className?: string;
}) => {
  const selected = installableLocales.find((locale) => locale.code === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Locale"
          aria-haspopup="menu"
          className={cn('h-8 rounded-md border bg-fd-secondary', className)}
        >
          {selected ? `${selected.label} (${selected.code})` : value}
          <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="docs-menu max-h-80 w-56 overflow-y-auto"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {installableLocales.map((locale) => (
            <DropdownMenuRadioItem key={locale.code} value={locale.code}>
              {locale.label} ({locale.code})
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
