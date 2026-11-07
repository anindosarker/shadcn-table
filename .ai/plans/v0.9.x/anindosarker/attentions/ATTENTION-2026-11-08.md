# Attention, 2026-11-08

## A1 Column size reset listener stays until the width transition ends

- Epic 03 said the reset helper listens for `transitionend` with `{ once: true }`; the merged code keeps listening until a `width` or `min-width` transitionend instead, because other transitions (button colors) bubble to the table first and `once` would leave `data-size-resetting` stuck.
- Code: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts`, `resetColumnSizeAnimated`. No timer, as D5 says.

- Options:
  - a) Recommended: keep (listener removes itself on the first `width` or `min-width` transitionend)
  - b) revert to `{ once: true }` as the epic wrote it
