# Install (/docs/install)

## Install [#install]

Pick your base with the tabs. Base UI is the shadcn style `base-nova`, Radix UI `radix-nova` and React Aria `aria-nova`.

Base UI:

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#v0.1.1
```

Radix UI:

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-radix#v0.1.1
```

React Aria:

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-aria#v0.1.1
```

The files land in `components/date-picker/`. The CLI adds the shadcn parts the picker uses (button, popover, dialog and others) from your own style. On Base UI and Radix UI the calendar is your style's calendar part too; on React Aria the picker brings its own day calendar, built on react-day-picker with the classes of shadcn's nova calendar.

The CLI rewrites the picker's imports to the aliases in your `components.json`, so a project with `~/` or a `src/` layout works as is.

Three places in the picker carry the classes of shadcn's nova style, whatever style your project uses: the dialog's close button (`absolute top-2 right-2`), the gap of the range fields in the phone dialog (`gap-2`) and the right corners of the trigger's button group (`rounded-r-lg`). On another style, change them in your copy if you want that style's values.

## Usage [#usage]

The picker is controlled: `value` and `onChange` are required.

```tsx
'use client';

import * as React from 'react';
import { DatePicker } from '@/components/date-picker/date-picker';

export function Example() {
  const [value, setValue] = React.useState('2026-11-21');
  const [range, setRange] = React.useState<[string, string]>([
    '2026-01',
    '2026-06',
  ]);
  return (
    <>
      <DatePicker type="date" value={value} onChange={setValue} />
      <DatePicker type="month" range value={range} onChange={setRange} />
    </>
  );
}
```

## What it does not do [#what-it-does-not-do]

- It shows no error message of its own and does not set `aria-invalid`. Your form does that; the picker passes `aria-invalid`, `aria-describedby`, `disabled`, `required`, `min`, `max` and `step` to the browser input.
- It adds no replacement for a control that a browser does not have.

## Differences between the bases [#differences-between-the-bases]

### Base UI [#base-ui]

- In the day calendar, arrow keys move the highlight but not keyboard focus, so Enter picks the day that had focus before. This is shadcn's stock `base-nova` calendar part ([shadcn-ui/ui#9401](https://github.com/shadcn-ui/ui/issues/9401)).
- Until it is fixed there, add `ref={ref}` to the day `Button` in your `components/ui/calendar.tsx`.

### Radix UI [#radix-ui]

- Tab moves round the controls of an open popover and does not close it. Escape or a press outside closes it.
- On a touch screen a popover and the phone dialog open with focus on their first control. The clock's popover opens as on Base UI.

### React Aria [#react-aria]

- Tab stays inside an open popover. Two hidden dismiss buttons for screen readers sit before and after its content.
- While a popover is open the page behind it does not scroll or take a press; a press outside only closes the popover.
- A popover opens with focus on the popover itself; its first control is one Tab away.
- The phone dialog opens with focus on the dialog itself; its close button is one Tab away.
- A range picker's popover is announced with the text of its trigger button, not with the picker's label.
- In a right-to-left page the popover of a box is shifted 8 px to the other side.
- A close that lands in the instant a popover opens can leave it on the page. This is stock react-aria-components behaviour; the picker adds no workaround.
- On a touch screen a popover can flicker once as it opens. This is stock react-aria-components behaviour; the picker adds no workaround.