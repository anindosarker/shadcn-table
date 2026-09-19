import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
// import Collapse from '@mui/material/Collapse'; // Note: replaced by radix Collapsible below.
// import { debounce } from '@mui/material/utils'; // Note: replaced by the local debounce helper below.
import {
  parseFromValuesOrFunc,
  type InputProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu';

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

  return (
    // <Collapse in={showGlobalFilter} mountOnEnter orientation="horizontal" unmountOnExit>
    // Note: radix Collapsible replaces MUI Collapse — no shadcn keyframe for horizontal (width) animation.
    <Collapsible open={showGlobalFilter}>
      <CollapsibleContent className="w-48">
        <InputGroup>
          {/* startAdornment — MUI <InputAdornment position="start"> wrapper dropped. */}
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              <SRT_Tooltip title={localization.changeSearchMode}>
                <InputGroupButton
                  size="icon-xs"
                  aria-label={localization.changeSearchMode}
                  onClick={handleGlobalFilterMenuOpen}
                >
                  <SearchIcon />
                </InputGroupButton>
              </SRT_Tooltip>
            </InputGroupAddon>
          ) : (
            // <SearchIcon style={{ marginRight: '4px' }} />
            // Note: InputGroupAddon supplies the spacing.
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
          )}

          <InputGroupInput
            autoComplete="off"
            placeholder={localization.search}
            onChange={handleChange}
            value={searchValue ?? ''}
            {...textFieldProps}
            ref={(node) => {
              searchInputRef.current = node;
              // if (textFieldProps?.inputRef) textFieldProps.inputRef = inputRef;
              // Note: user input-ref forwarding deferred.
            }}
          />

          {/* endAdornment — MUI <InputAdornment position="end"> wrapper dropped. */}
          <InputGroupAddon align="inline-end">
            <SRT_Tooltip title={localization.clearSearch ?? ''}>
              <span>
                <InputGroupButton
                  size="icon-xs"
                  aria-label={localization.clearSearch}
                  disabled={!searchValue?.length}
                  onClick={handleClear}
                >
                  <CloseIcon />
                </InputGroupButton>
              </span>
            </SRT_Tooltip>
          </InputGroupAddon>
        </InputGroup>

        <SRT_FilterOptionMenu
          anchorEl={anchorEl}
          onSelect={handleClear}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
