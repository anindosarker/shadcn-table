import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface SRT_GlobalFilterTextFieldProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Global filter text field - search input for filtering all columns
 *
 * Barebones implementation:
 * - Debounced search input
 * - Search icon prefix
 * - Clear button suffix
 * - Auto-focus when shown
 * - Collapse animation
 *
 * TODO (Future enhancements):
 * - Add filter mode menu (fuzzy, contains, startsWith, etc.)
 * - Add srtSearchTextFieldProps to core package types
 * - Improve collapse animation with Radix UI
 * - Add search result count badge
 * - Add keyboard shortcuts (Escape to clear)
 * - Add recent searches dropdown
 */

export const SRT_GlobalFilterTextField = <TData extends SRT_RowData>({
  table,
  className,
}: SRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      // enableGlobalFilterModes, // TODO: Add filter mode menu
      localization,
      manualFiltering,
      // srtSearchTextFieldProps, // TODO: Add custom props support
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const isMounted = useRef(false);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  // Debounce the filter update
  const handleChangeDebounced = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(
          () => {
            setGlobalFilter(value || undefined);
          },
          manualFiltering ? 500 : 250,
        );
      };
    })(),
    [manualFiltering, setGlobalFilter],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    handleChangeDebounced(value);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  // Sync with external globalFilter changes
  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        setSearchValue('');
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
  }, [globalFilter]);

  if (!showGlobalFilter) return null;

  return (
    <div
      className={cn(
        'relative flex items-center',
        'animate-in slide-in-from-right-5 duration-200',
        className,
      )}
    >
      {/* Search Icon */}
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />

      {/* Input Field */}
      <input
        ref={searchInputRef}
        type="text"
        value={searchValue ?? ''}
        onChange={handleChange}
        placeholder={localization.search}
        autoComplete="off"
        className={cn(
          'h-9 w-48 rounded-md border border-input bg-background pl-9 pr-9',
          'text-sm ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />

      {/* Clear Button */}
      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          aria-label={localization.clearSearch}
          title={localization.clearSearch}
          className="absolute right-1 h-7 w-7"
        >
          <XIcon className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* TODO: Add filter mode menu */}
      {/* {enableGlobalFilterModes && (
        <SRT_FilterOptionMenu table={table} />
      )} */}
    </div>
  );
};

// TODO: Add these features in future iterations:
// 1. Filter mode menu (fuzzy, contains, startsWith, etc.)
// 2. Support for srtSearchTextFieldProps
// 3. Search result count badge
// 4. Recent searches dropdown
// 5. Keyboard shortcuts (Escape to clear, Cmd+K to focus)
// 6. Better animation with Radix UI Collapsible
