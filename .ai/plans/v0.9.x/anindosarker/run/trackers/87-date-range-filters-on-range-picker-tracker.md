# 87: Date range filters on the range picker, tracker

Status: running
Branch `v0.9/date-range-filters-on-range-picker`, worktree 06
Checks:
- Check: proof play date, base, `ST_BASE=base vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` (Date Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play datetime, base, same run (Date Time Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play time, base, same run (Time Start Only Then End Only) at 803ad5680 + story: pass
- Check: proof play date, radix, `ST_BASE=radix vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` at 803ad5680 + story: pass
- Check: proof play datetime, radix, same run at 803ad5680 + story: pass
- Check: proof play time, radix, same run at 803ad5680 + story: pass
- Check: proof play date, aria, `ST_BASE=aria vitest run stories/miscellaneous/RangePickerOneEnd.stories.tsx` at 803ad5680 + story: pass
- Check: proof play datetime, aria, same run at 803ad5680 + story: pass
- Check: proof play time, aria, same run at 803ad5680 + story: pass

Notes:
- Task 1: the picker's range mode hands one end alone to onChange for date, datetime and time on the three bases: a typed start gives `[start, '']`, a typed end with an empty start gives `['', end]` (`picker: utils/range.ts:31-33` putEnd). The proof story `stories/miscellaneous/RangePickerOneEnd.stories.tsx` is deleted before the merge (1.6.1).
- React Aria's range popover is found by `[role="dialog"][aria-label]`, not by `findByRole`: testing-library does not see it in the accessibility tree there.

- Task 1 One end only, proven in the picker: done (see commit)
