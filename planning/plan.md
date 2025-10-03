## Core philosophy
Shadcn philosphy is to create the components and ui design blocks in the `user's` project. So, we will not ship prebuilt components in the package. Rather, we will ship wrapper components, types, utils and other necessary stuff that the package adds as extra features on top of tanstack table.

When users will install the package `shadcn-react-table-core`, they will get all the additional capablities, utils etc. They will create the DataTable component with the `shadcn-react-table-cli` in their `ui/` folder. And that component will use components like buttons etc from their ui library, but they will get the additional features through the package

## Plan and tasks:
- [x]  Run the project
- [x] Create 2 packages, shadcn-react-table-cli and shadcn-react-table-core
    - [x] - shadcn-react-table-cli will be used to create the table component in user's repos
    - [x] - shadcn-react-table-core will be used to create the table component
- [x] Remove old shadcn-react-table package since we don't need it anymore
- [ ] Port components

        - [ ] /body
        - [ ] /buttons
        - [ ] /footer
        - [ ] /head
        - [ ] /inputs
        - [ ] /menus
        - [ ] /modals
        - [ ] /table
                - [ ] /table/MRT_Table.tsx
                - [ ] /table/MRT_TableContainer.tsx
                        - cva for className overrides
                        - MRT_TableLoadingOverlay
                        - MRT_EditRowModal
                        - MRT_CellActionMenu
 
                - [x] /table/MRT_TableLoadingOverlay.tsx
                - [ ] /table/MRT_TablePaper.tsx
                        - Add bottom toolbar
                        - cva for className overrides
        - [ ] /toolbar
        - [x] /MaterialReactTable.tsx
- [ ] port hooks
        - [ ]