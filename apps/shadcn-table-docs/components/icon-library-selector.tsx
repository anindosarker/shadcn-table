'use client';

import { createContext, use, useState, type ReactNode } from 'react';
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
import {
  defaultIconLibrary,
  iconLibraries,
  iconLibraryLabels,
  isIconLibrary,
  type IconLibrary,
} from '@/lib/install';

interface IconLibraryState {
  library: IconLibrary;
  setLibrary: (library: IconLibrary) => void;
}

const IconLibraryContext = createContext<IconLibraryState | null>(null);

/**
 * The icon library picked for the install commands of a page, shared by every
 * `InstallCommand` under it. Plain React state, nothing persisted: a fresh
 * page load starts on Lucide.
 */
export const IconLibraryProvider = ({ children }: { children: ReactNode }) => {
  const [library, setLibrary] = useState<IconLibrary>(defaultIconLibrary);
  return (
    <IconLibraryContext value={{ library, setLibrary }}>
      {children}
    </IconLibraryContext>
  );
};

/**
 * The shared icon library pick. Outside an `IconLibraryProvider` it falls
 * back to local state, so a command still switches on its own.
 */
export const useIconLibrary = (): IconLibraryState => {
  const shared = use(IconLibraryContext);
  const [library, setLibrary] = useState<IconLibrary>(defaultIconLibrary);
  return shared ?? { library, setLibrary };
};

/**
 * Select button for the icon library edition, the same control as the
 * header's base select (BaseSwitch, components/base-selector.tsx): the
 * selected library and a chevron, opening a radio menu over the editions.
 */
export const IconLibrarySwitch = ({
  value,
  onValueChange,
  className,
}: {
  value: IconLibrary;
  onValueChange: (library: IconLibrary) => void;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Icon library"
        aria-haspopup="menu"
        className={cn('h-8 rounded-md border bg-fd-secondary', className)}
      >
        {iconLibraryLabels[value]}
        <ChevronDownIcon data-icon="inline-end" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="docs-menu w-40">
      <DropdownMenuRadioGroup
        value={value}
        onValueChange={(next) => {
          if (isIconLibrary(next)) onValueChange(next);
        }}
      >
        {iconLibraries.map((library) => (
          <DropdownMenuRadioItem key={library} value={library}>
            {iconLibraryLabels[library]}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
