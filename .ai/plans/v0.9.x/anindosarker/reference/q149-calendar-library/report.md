# Report: the calendar library (Q149)

Date: 2026-11-23. Status: the owner gave these points. The decision is not recorded in `decisions.md` yet.

## 1. Summary

- The project gets a calendar library. The library contains the date picker.
- The Base UI version is complete. It is in the test application. The library uses this code and does not change it.
- The library also gets a Radix version and a React Aria version.
- The table registry serves the library for now.
- The library is a separate package in the repository of the table. It has a separate documentation site.

## 2. Source of the code

- Folder: `test-projects/next-app/components/date-picker/` in the workspace `React-table`.
- Version: 9.3.6. Commit in the test application: `53f4b4f`. The folder has 22 files.
- The owner approved this code.
- The component is `<DatePicker type="date|datetime|time|week|month|year" range? />`.
- The code has no import from the table.
- The history of the picker is in `reference/q88-date-filter-demo/review-notes.md`.

### 2.1 The exact-copy rule

- The Base UI version of the library must be EXACTLY the approved code.
- Copy each of the 22 files. Do not change a line of code, a comment, a file name or a folder name.
- Do not add a file to the folder. Do not remove a file. Do not move a file.
- Only one change is permitted: an import path, when the library has a different path for the same part.
- Proof: `diff -r` between the approved folder and the library folder shows import paths only.
- A necessary change to the code is a decision of the owner. An agent does not make this change.

### 2.2 Code structure

```
date-picker/
  date-picker.tsx              the DatePicker component; it selects the mode for `type` and `range`
  types.ts                     the public types, and the types that two or more files use
  modes/                       one file for each kind of picker
    day-picker.tsx             date and date-time
    day-range-picker.tsx       date range and date-time range
    period-picker.tsx          week, month and year
    period-range-picker.tsx    week range, month range and year range
    time-range-picker.tsx      time range
  components/                  the parts that the modes use
    day-calendar.tsx           the day calendar, on the stock shadcn Calendar
    period-views.tsx           the week calendar, the month grid and the year grid
    picker-box.tsx             a typed box with a button that opens a popover
    picker-field.tsx           the browser input for one value
    picker-popup.tsx           the popover, or the dialog on a phone
    picker-presets.tsx         the list of presets
    picker-trigger.tsx         the button that shows a range and opens the popover
    time-columns.tsx           the clock lists
    time-field.tsx             the time box with its clock
    view-nav.tsx               the previous, Today and next buttons
  utils/                       functions without React components
    labels.ts                  the default labels and the labels context
    range.ts                   functions for the two ends of a range
    time.ts                    functions for times, limits and steps
    values.ts                  functions that read and write value strings
    views.ts                   functions for the months and years that a calendar shows
```

- A single time picker uses `components/time-field.tsx`. It has no file in `modes/`.

### 2.3 Parts that the code imports

- shadcn parts: `badge`, `button`, `button-group`, `calendar`, `dialog`, `field`, `input-group`, `native-select`, `popover`.
- The hook `use-mobile` of shadcn.
- The `cn` function.
- npm packages: `react`, `react-day-picker`, `date-fns`, `lucide-react`, `@base-ui/react`.

## 3. Rules that the owner made for the picker

Keep these rules in each version of the library.

- The picker shows no error message. The picker does not set `aria-invalid`. The form does these tasks.
- The picker passes `aria-invalid`, `aria-describedby`, `disabled`, `required`, `min`, `max` and `step` to the browser input.
- The picker uses the browser inputs. The picker adds no replacement for a control that a browser does not have.
- The picker has no rule of its own where the browser or a library does the task.
- The calendars use the native `select` element for the month and the year.
- `types.ts` contains the public types and the types that two or more files use.
- `labels.ts` is in `utils/`. `date-picker.tsx` does not export the types again.
- The code has three comments only: one JSDoc block on `DatePicker`, one on `fromYmd` and one on `startOfPeriod`. Comments use ASD-STE100.

## 4. Folder structure

```
packages/
  shadcn-table/           the table (no change)
  shadcn-calendar/        the calendar library: code, registry items, tests
apps/
  shadcn-table-docs/      the documentation site of the table (no change)
  shadcn-calendar-docs/   the documentation site of the calendar
```

- The workspace file `pnpm-workspace.yaml` includes `packages/*` and `apps/*`. A new package and a new application need no change in this file.
- The table package contains no calendar file.
- The calendar package contains no table file.

## 5. Versions for the three base libraries

- The table has three versions: Base UI, Radix and React Aria. The calendar library gets the same three versions.
- The Base UI version is the code from section 2. The exact-copy rule of section 2.1 applies.
- The Radix version and the React Aria version use the same folder structure and the same file names as section 2.2.
- The Radix version and the React Aria version are new work. Each version must have the same behaviour and the same appearance as the Base UI version.
- The Base UI version is the reference for the tests of the other two versions.

## 6. Distribution

- The table registry serves the calendar items for now. The items use the name `@shadcn-table`.
- The name `@shadcn-table` is in the registry directory of shadcn. A user does not give an address.
- The date filter of the table depends on the calendar item. The shadcn CLI installs the calendar when a user installs the table.
- A user can install the calendar only.

Install the table:

```
pnpm dlx shadcn@latest registry add @shadcn-table
pnpm dlx shadcn@latest add @shadcn-table/shadcn-table
```

Install the calendar only (the item name `date-picker` is an example):

```
pnpm dlx shadcn@latest registry add @shadcn-table
pnpm dlx shadcn@latest add @shadcn-table/date-picker
```

## 7. A possible move to a separate repository

- The owner moves the library only if other people ask for it.
- The move is a copy of `packages/shadcn-calendar` and `apps/shadcn-calendar-docs` with their history.
- After the move, the library gets its own registry name and its own entry in the registry directory of shadcn.
- In the table, one line changes: the address of the calendar item.
- The owner also plans an issue in the shadcn/ui repository. The issue proposes the picker for shadcn/ui. This plan does not change the work in this report.

## 8. Priority

- Version 1 of the table is the primary task of the owner. The calendar work must not delay it.

## 9. Open points

| Point                                                                      | Status               |
| -------------------------------------------------------------------------- | -------------------- |
| Name of the registry item (`date-picker` or `calendar`)                | Not decided          |
| Address of the calendar documentation site                                 | Not decided          |
| Width of the date-time range popover in Chrome (540 px now, 492 px before) | Not decided          |
| A year of five digits in Safari                                            | Not tested in Safari |
| Desktop Safari, iPhone, right-to-left pages                                | Not tested           |

## 10. Facts that are not examined yet

- The registry build, the release tools and the CI configuration work with one package now. The changes for a second package are not known.
- The method to publish items from two packages with the name `@shadcn-table` is not known.
- The number of registry items in the table is not known. The item that gets the dependency on the calendar is not known.
- The demonstration page checks of the test application are not library tests yet. The library needs stories with tests, as the table has.
