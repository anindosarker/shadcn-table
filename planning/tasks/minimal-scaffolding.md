# Minimal Scaffolding Task List

**Goal:** Get shadcn-react-table working with basic table rendering and minimal features

## Status Legend
- ⏳ Todo
- 🚧 In Progress
- ✅ Done
- ⏭️ Skipped (for later)

---

## Phase 1: Clean Up Existing Components

### 1.1 Rename & Convert MRT Components to SRT ✅
- [x] Rename `MRT_TablePagination.tsx` → `SRT_TablePagination.tsx` ✅
- [x] Delete `MRT_ToolbarAlertBanner.tsx` (will create when needed) ✅
- [x] Delete `MRT_ToolbarDropZone.tsx` (will create when needed) ✅
- [x] Delete `MRT_ToolbarInternalButtons.tsx` (will create when needed) ✅
- [x] Convert `SRT_BottomToolbar.tsx` (already renamed, needs cleanup) ✅

### 1.2 Enhance Core Table Components ✅
- [x] Fix `SRT_Table.tsx` - Add proper flexRender for headers and cells ✅
- [x] Create `SRT_TableHead.tsx` - Basic header row rendering ✅
- [x] Create `SRT_TableHeadRow.tsx` - Header row wrapper ✅
- [x] Create `SRT_TableHeadCell.tsx` - Individual header cell ✅
- [x] Create `SRT_TableBody.tsx` - Body with rows and empty state ✅
- [x] Create `SRT_TableBodyRow.tsx` - Individual body row ✅
- [x] Create `SRT_TableBodyCell.tsx` - Individual body cell ✅

---

## Phase 2: Minimal Toolbar Components

### 2.1 Bottom Toolbar ✅
- [x] Clean `SRT_BottomToolbar.tsx` - Remove MUI dependencies ✅
- [x] Implement basic `SRT_TablePagination.tsx` with shadcn Button ✅
- [x] Enable bottom toolbar in `SRT_TableLayout.tsx` ✅

### 2.2 Top Toolbar ⏳
- [x] Enhance `SRT_TopToolbar.tsx` with basic structure (already done)
- [ ] Add placeholder for global filter (comment for now) 🚧
- [ ] Add placeholder for toolbar buttons (comment for now) 🚧

---

## Phase 3: Missing Components (Minimal/Commented)

### 3.1 Alert & Drop Zone ⏭️
- [ ] Create `SRT_ToolbarAlertBanner.tsx` - Basic Alert from shadcn (when needed)
- [ ] Create `SRT_ToolbarDropZone.tsx` - For column grouping (when needed)

### 3.2 Internal Buttons ⏭️
- [ ] Create `SRT_ToolbarInternalButtons.tsx` - Filter/search/density toggles (when needed)

---

## Phase 4: Testing & Validation

### 4.1 App Testing ✅
- [x] Update `App.tsx` - Remove loading state to see actual data ✅
- [x] Test basic table rendering with 3 rows ✅
- [x] Test pagination if enabled ✅
- [x] Verify build passes (no TypeScript errors) ✅

### 4.2 Documentation ✅
- [x] Add comments to each component explaining what's implemented ✅
- [x] Add TODO comments for future enhancements ✅
- [x] Update task list with completion status ✅
- [x] Create summary document ✅

---

## Future Enhancements (Out of Scope for Minimal)

- ⏭️ Sorting UI (column headers clickable)
- ⏭️ Filtering UI (input fields in headers)
- ⏭️ Column actions menu
- ⏭️ Row selection checkboxes
- ⏭️ Row actions
- ⏭️ Detail panels
- ⏭️ Editing inline
- ⏭️ Virtualization
- ⏭️ Column resizing
- ⏭️ Column ordering
- ⏭️ Dense/comfortable/spacious modes UI
- ⏭️ Fullscreen mode UI

---

## Notes

- Using native HTML table elements with Tailwind classes
- Using shadcn components where available (Button, Select, Alert, etc.)
- Keeping structure similar to MRT but simplified
- All TODOs marked for future feature additions
- Focus on **working table that displays data**

---

## ✅ COMPLETION STATUS

**Date Completed:** October 1, 2025  
**Build Status:** ✅ Successful (304.20 kB JS, 22.27 kB CSS)  
**Components Created:** 7 new table components + 1 pagination component  
**Components Cleaned:** 1 bottom toolbar + 1 table layout  
**Files Deleted:** 4 MUI-based components  

### What You Can Do Now:
```bash
cd apps/test-shadcn
npm run dev
```

Visit http://localhost:5173 to see:
- ✅ Table with 3 rows of data rendering
- ✅ Headers with proper formatting
- ✅ Pagination controls (navigation buttons)
- ✅ Empty state handling
- ✅ Loading overlay (if enabled)
- ✅ Progress bar (if enabled)

### Next: Run the Dev Server!

See `minimal-scaffolding-summary.md` for complete details.

