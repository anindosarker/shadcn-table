# Q88 date filter demo, audit brief for the runner

The owner likes the look of the ten picked cards and will not let them into the library before an audit. Owner, 2026-11-15: "for all of them, we need an audit to know: the implementation, code quality, deviation from source/custom implementations, any additional libraries, accessibility issues etc."

Read-only on the demo code: the audit changes nothing in `test-projects/next-app` and nothing in the library. It is a preview for a decision, outside the grid. Run it as one Workflow: one auditor per lens, each claim verified by a second agent before it is reported (a finding nobody could reproduce is dropped and counted).

## Scope

- The ten picked cards of `test-projects/next-app/app/date-filter-demo/page.tsx` (picks `picks.json`, defaults `defaults.json`, commit `6db0517` or later): 1.A, 2.A, 2.B, 3.A, 3.G, 4.A, 4.G, 4.H, 5.A, 6.A, and everything they share: the Calendar setup, the built time picker, the clear X, the popover wiring, the native-box helpers (the `value` attribute removal, `min` and `max`).
- Not in scope: the unpicked cards, the Pick and Default checkboxes, the picks API route, the playground header.
- The owner's dev server at `http://localhost:3000` may be used with a headless browser. Never start, stop or restart a dev server.

## Lenses, one section each in the report, per card where it differs

1. Implementation: what each card is made of (components, props, state, effects, event handlers), in plain words, with file:line; what is shared between cards; how a value gets from the control to the string the filter stores (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`, `HH:mm`) and back.
2. Code quality: against `shadcn-react-table/docs/code-of-conduct/coding-standards.md`, cited by section. Effects, observers and timers that can leak or loop; state that can go out of step with the box; time zone and DST handling of the date strings; anything that only works by accident.
3. Deviation from source: for every shadcn piece, the docs example it comes from (https://ui.shadcn.com/docs/components/base/date-picker, calendar, input-group, popover, scroll-area, button-group, field) and every line that differs from it, with the reason the demo gives or "no reason found". List separately everything that is custom, meaning not in any shadcn example: the time picker, the clear X, the `value` attribute MutationObserver, the popover placed outside the InputGroupAddon, the shared range Calendar anchoring. For each custom part: is there a stock shadcn or library way that does the same.
4. Additional libraries: every package and every shadcn component the ten cards need beyond what the library's core item requires today (registryDependencies of `shadcn-table` per base), with version, size where measurable (bundle impact of `react-day-picker` and `date-fns`), license, and whether the same works on the three bases (Base UI, Radix, React Aria: which parts are base-specific and what the React Aria base would use).
5. Accessibility: per card, with a real run where possible (axe on the open and closed states, keyboard only, and the accessibility tree): roles and names of every control and button, label association, focus order, focus return on close and on clear, Escape, arrow keys in the Calendar and in the time picker columns, announced value changes, touch target sizes, contrast of themed parts in light and dark, behavior at 200 percent zoom and 360 px. State what a screen reader user hears for the built time picker. WCAG 2.2 AA criterion per finding.
6. Browsers and devices: Chromium, Firefox and WebKit through Playwright builds where available; what differs per card (native box rendering, hidden native icons, the picker popups). iOS and Android behavior is stated as verified or not verified; nothing is assumed.
7. Fit for the library: what moving each card into `ST_FilterTextField.tsx` and the range fields changes (the stored strings, commit on Enter and blur, the existing plays and docs E2E helper that type into native boxes), read-only, with file:line. No design, facts only.

## Report

- `audit.md` next to this brief, on `claude/review`: one section per lens, each finding one bullet with severity (blocker, major, minor), the card ids, file:line, and proof (command, capture path or quoted doc). A first section of at most fifteen lines states the blockers and majors in plain words for the owner. Captures in this folder.
- Add the summary facts to card Q88 with `queue/item.py --fact Q88`, each under 700 characters.
- Send the lead `AUDIT Q88 blockers: n, majors: n` with the commit id.
