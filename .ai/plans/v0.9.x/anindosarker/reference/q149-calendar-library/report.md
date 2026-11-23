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
- Version: 9.3.6. The folder has 22 files.
- Parts: `date-picker.tsx` (the component), `types.ts`, `modes/`, `components/`, `utils/`.
- The owner approved this code. Copy it into the library. Do not change the code, the file names or the folder names.
- The component is `<DatePicker type="date|datetime|time|week|month|year" range? />`.
- The code uses these parts: shadcn components on Base UI, `react-day-picker` and `date-fns`.
- The code has no import from the table.
- The history of the picker is in `reference/q88-date-filter-demo/review-notes.md`.

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
- The Base UI version is the code from section 2.
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

| Point | Status |
|---|---|
| Name of the registry item (`date-picker` or `calendar`) | Not decided |
| Address of the calendar documentation site | Not decided |
| Width of the date-time range popover in Chrome (540 px now, 492 px before) | Not decided |
| A year of five digits in Safari | Not tested in Safari |
| Desktop Safari, iPhone, right-to-left pages | Not tested |

## 10. Facts that are not examined yet

- The registry build, the release tools and the CI configuration work with one package now. The changes for a second package are not known.
- The method to publish items from two packages with the name `@shadcn-table` is not known.
- The number of registry items in the table is not known. The item that gets the dependency on the calendar is not known.
- The demonstration page checks of the test application are not library tests yet. The library needs stories with tests, as the table has.
