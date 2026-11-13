# 45: Filter Mode caption gap, tracker

Status: running
Runs in milestone Filter editor fixes, tracker 41-range-filter-editor-tracker.md

- Captures, a popover filter open on the Name column (`columnFilterDisplayMode="popover"`, story in headless Chromium), before at f13027c7 and after the change: `41-shots/before-base-caption.png`, `41-shots/after-base-caption.png`, `41-shots/before-radix-caption.png`, `41-shots/after-radix-caption.png`, `41-shots/before-aria-caption.png`, `41-shots/after-aria-caption.png`. Measured gap between the input group and the caption: 3 px before, 6 px after on the three bases; the popover grows from 68 to 71 px, nothing else moves.
- `grep -rn "mt-0.75 block text-xs" .../inputs`: prints nothing; the `grep -rc ... | awk` line of 1.2: 9.
