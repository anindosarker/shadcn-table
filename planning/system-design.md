## Core philosophy
Shadcn philosphy is to create the components and ui design blocks in the `user's` project. So, we will not ship prebuilt components in the package. Rather, we will ship wrapper components, types, utils and other necessary stuff that the package adds as extra features on top of tanstack table.

When users will install the package `shadcn-react-table-core`, they will get all the additional capablities, utils etc. They will create the DataTable component with the `shadcn-react-table-cli` in their `ui/` folder. And that component will use components like buttons etc from their ui library, but they will get the additional features through the package

## Development Strategy
- Look into the code from original material-react-table package.
- We will port each components from the top down approach.
- We will mimic creating the root ShadcnReactTable component, that mimics the MaterialReactTable componet. It will have similar child components for example: MRT_TableConatiner -> SRT_TableContainer etc