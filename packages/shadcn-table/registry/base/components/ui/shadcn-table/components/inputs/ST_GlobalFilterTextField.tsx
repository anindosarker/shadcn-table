import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  type InputProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import {
  debounce,
  parseFromValuesOrFunc,
} from '@/components/ui/shadcn-table/utils/utils';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import { ST_FilterOptionMenu } from '@/components/ui/shadcn-table/menus/ST_FilterOptionMenu';

export interface ST_GlobalFilterTextFieldProps<TData extends ST_RowData>
  extends InputProps {
  table: ST_TableInstance<TData>;
}

export const ST_GlobalFilterTextField = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_GlobalFilterTextFieldProps<TData>) => {
  const {
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      stSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = table.state;

  const textFieldProps = {
    ...parseFromValuesOrFunc(stSearchTextFieldProps, {
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
    // Note: MUI Collapse → ui/Collapsible; Base UI unmounts the closed panel (= mountOnEnter/unmountOnExit) and sets data-open/data-closed with --collapsible-panel-width; the horizontal width keyframes (MUI duration.standard, easeInOut) live in the app stylesheet.
    <Collapsible open={showGlobalFilter}>
      <CollapsibleContent className="data-closed:animate-[st-collapsible-left_300ms_var(--ease-in-out)] data-open:animate-[st-collapsible-right_300ms_var(--ease-in-out)]">
        {/* <TextField size="small" variant="outlined" InputProps={{ ...textFieldProps.InputProps, sx: { mb: 0 } }} /> */}
        {/* Note: InputGroup is MUI's Input root in shadcn's default variant; the slot type is input props, so InputProps and its sx have no target. */}
        <InputGroup>
          {enableGlobalFilterModes ? (
            <InputGroupAddon align="inline-start">
              <ST_Tooltip title={localization.changeSearchMode}>
                <InputGroupButton
                  aria-label={localization.changeSearchMode}
                  onClick={handleGlobalFilterMenuOpen}
                  size="icon-sm"
                  className="size-7"
                >
                  <SearchIcon />
                </InputGroupButton>
              </ST_Tooltip>
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
            onChange={handleChange}
            placeholder={localization.search}
            value={searchValue ?? ''}
            {...textFieldProps}
            ref={(inputRef) => {
              searchInputRef.current = inputRef;
              // if (textFieldProps?.inputRef) { textFieldProps.inputRef = inputRef; }
              // Note: no-op in MRT too; a user ref is overridden by this one, as MRT's inputRef after the spread.
            }}
          />
          <InputGroupAddon align="inline-end">
            <ST_Tooltip title={localization.clearSearch ?? ''}>
              <span>
                <InputGroupButton
                  aria-label={localization.clearSearch}
                  disabled={!searchValue?.length}
                  onClick={handleClear}
                  size="icon-sm"
                >
                  <CloseIcon />
                </InputGroupButton>
              </span>
            </ST_Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <ST_FilterOptionMenu
          anchorEl={anchorEl}
          onSelect={handleClear}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
