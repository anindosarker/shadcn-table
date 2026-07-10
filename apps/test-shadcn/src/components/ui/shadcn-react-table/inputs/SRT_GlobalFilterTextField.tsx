import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
// import Collapse from '@mui/material/Collapse'; // Note: dropped — conditional render below.
// import { debounce } from '@mui/material/utils'; // Note: replaced by June's local setTimeout debounce below.
import {
  parseFromValuesOrFunc,
  type InputProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

// June's browser-verified input styling, reused verbatim.
const globalFilterTextFieldVariants = cva([
  'h-9 w-48 rounded-md border border-input bg-background pl-9 pr-9',
  'text-sm ring-offset-background',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
]);

// MUI IconButton (size="small", sx { height/width: '1.75rem' }) → reset classes;
// h-7 w-7 = 1.75rem.
const globalFilterIconButtonVariants = cva(
  'inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
);

// Note: MRT's `debounce` from `@mui/material/utils` → June's local
// setTimeout-based debounce (keeps the package MUI-free).
function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export interface SRT_GlobalFilterTextFieldProps<TData extends SRT_RowData>
  extends InputProps {
  table: SRT_TableInstance<TData>;
}

export const SRT_GlobalFilterTextField = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      srtSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const textFieldProps = {
    ...parseFromValuesOrFunc(srtSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined);
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    handleChangeDebounced(event);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear();
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  // Note: MUI <Collapse in={showGlobalFilter} mountOnEnter orientation="horizontal"
  // unmountOnExit> dropped — replaced by the conditional render below.
  if (!showGlobalFilter) return null;

  return (
    <div className="relative flex items-center">
      {/* startAdornment — MUI <InputAdornment position="start"> wrapper dropped. */}
      {enableGlobalFilterModes ? (
        <SRT_Tooltip title={localization.changeSearchMode}>
          <button
            type="button"
            aria-label={localization.changeSearchMode}
            className={cn(globalFilterIconButtonVariants(), 'absolute left-1')}
            onClick={handleGlobalFilterMenuOpen}
          >
            <SearchIcon size={16} />
          </button>
        </SRT_Tooltip>
      ) : (
        <SearchIcon
          className="absolute left-2.5 text-muted-foreground"
          size={16}
          style={{ marginRight: '4px' }}
        />
      )}

      <input
        autoComplete="off"
        placeholder={localization.search}
        onChange={handleChange}
        value={searchValue ?? ''}
        {...textFieldProps}
        className={cn(
          globalFilterTextFieldVariants(),
          textFieldProps.className,
        )}
        ref={(node) => {
          searchInputRef.current = node;
          // Note: MRT also did `if (textFieldProps?.inputRef) textFieldProps.inputRef = inputRef`
          // — user input-ref forwarding deferred to a slot-props style if needed.
        }}
      />

      {/* endAdornment — MUI <InputAdornment position="end"> wrapper dropped. Button
          stays wrapped in <span> so SRT_Tooltip can anchor it while disabled. */}
      <SRT_Tooltip title={localization.clearSearch ?? ''}>
        <span className="absolute right-1">
          <button
            type="button"
            aria-label={localization.clearSearch}
            className={globalFilterIconButtonVariants()}
            disabled={!searchValue?.length}
            onClick={handleClear}
          >
            <CloseIcon size={16} />
          </button>
        </span>
      </SRT_Tooltip>

      {/* MUI TextField `size="small"` / `variant="outlined"` and InputProps.sx
          `mb: 0` dropped — no MUI baseline to reset. */}

      <SRT_FilterOptionMenu
        anchorEl={anchorEl}
        onSelect={handleClear}
        setAnchorEl={setAnchorEl}
        table={table}
      />
    </div>
  );
};
