# Brief: the browser's own icon in the date picker's typed boxes (Firefox)

For a fresh session the owner talks to directly. Written by `v0.9.x runner12` on 2026-11-22.

## The problem

- The date picker's typed boxes are native inputs (`date`, `datetime-local`, `time`, `month`) inside a box that has the picker's own calendar or clock button.
- One class hides the browser's own picker icon: `[&::-webkit-calendar-picker-indicator]:hidden`. Only Chrome, Edge and Safari apply it.
- Firefox (109 and later) draws its own button inside the input and ignores that rule. Result: two icons in one box. First recorded as M5 in `audit.md:105`, later listed as "accepted, not fixable here" (`audit-3.md:17`).

## Where things are

- Demo app: `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` (own git repo, no remote, branch `playground/header-demo-theming`). Page `http://localhost:3000/date-filter-demo`.
- The line: `components/<version>/components/picker-field.tsx`, the `className` of the input (near line 191).
- Versions, each a full folder under `components/`:
  - `date-picker-9`: the rebuild. `date-picker-9-1`: month typed in a box.
  - `date-picker-9-1-1`: browser's icon shown everywhere. Cards `1.AE`, `2.AD`, `3.AJ`, `4.AY`, `5.P`, `6.P`.
  - `date-picker-9-1-2`: icon hidden in every browser. Cards `1.AF`, `2.AE`, `3.AK`, `4.AZ`, `5.Q`, `6.Q`. Its Firefox rule: `supports-[-moz-appearance:none]:text-transparent supports-[-moz-appearance:none]:[-webkit-text-fill-color:var(--color-foreground)]`.
  - `date-picker-9-2`: week typed in a box, being built by a workflow of runner12. Do not touch it or the card files of rows 7 to 10 while it is uncommitted.

## Facts already looked up (sources in runner12's session)

- Firefox's button is `<button id="picker-button">` in the input's closed shadow DOM (`toolkit/content/widgets/datetimebox.js`). No pseudo-element reaches it. Mozilla declined the WebKit pseudo (bugs 1830890, 2051201, 1812397, 1817839, all open).
- Its colour is `color-mix(in srgb, currentColor 65%, transparent)`. Hence the trick in 9.1.2: transparent `color`, text painted back with `-webkit-text-fill-color`.
- Firefox hides the button itself only for `:disabled` and `:read-only` inputs.
- `@supports (-moz-appearance: none)` matches only in Firefox.
- shadcn's date picker recipe has no native date input (button, popover, calendar; a plain text input where typed), so it has no browser icon. Its time example uses a native time input with the same WebKit-only rule.

## Seen so far

- The owner's Firefox, headless screenshot, empty time boxes: version 9 and 9.1.1 show two clock icons; 9.1.2 shows one, hint text readable.
- Not seen: a typed value in Firefox on 9.1.2 (text readable, selection, invalid and disabled colours), whether the invisible button still takes clicks and opens Firefox's own picker, the date and date-time rows.

## Tools

- Playwright's Firefox does not start on this machine ("Could not find profile folder"), also after a fresh download.
- The installed Firefox takes a headless picture: `/Applications/Firefox.app/Contents/MacOS/firefox --headless -no-remote -profile <scratch dir> --window-size=1280,9000 --screenshot <png> <url>`. It cannot type or click. For that, drive the real Firefox (browser-use, agent-browser, or computer use), or the owner looks.

## Rules of this repo and owner

- Port 3000 is the owner's dev server: never start, stop or restart it; never `next build`.
- Never touch `app/date-filter-demo/defaults.json` or `picks.json`; never tick Pick or Default.
- A card or version folder the owner has seen is frozen: a change is a new version folder (full copy) and new cards, numbered from its base (a change on 9.1.2 is 9.1.3 or 9.1.2.1, as the owner says).
- Stage by explicit path, no `git add -A`, no stash, no push in next-app.
- Discuss first; no edit before the owner says go. Replies in short bullets, plain words.
- The owner's rule for browsers that lack a control: the plain native element, nothing added. Hiding an icon a browser draws on top of the design is a different case; he decides it.
- Stock Tailwind and shadcn parts; no pixel guesses; no JavaScript browser detection.
