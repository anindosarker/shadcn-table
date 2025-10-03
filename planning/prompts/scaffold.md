Scaffold the component similar to the one from the material-react-table package.

- Create basic designs in the SRT component that closely matches with the equivalent MRT component
- Remove mui related components, designs, theming etc
- If any utils are missing in the core package, notfiy before proceeding.
- Read the MRT component first to understand what are the features
- Implement a short barebones version first that works, we will add further functionalities later
- Create the component in `test-shadcn` project. I'll port it to the cli later.

## System architecture overview
### Core philosophy
Shadcn philosphy is to create the components and ui design blocks in the `user's` project. So, we will not ship prebuilt components in the package. Rather, we will ship wrapper components, types, utils and other necessary stuff that the package adds as extra features on top of tanstack table.

When users will install the package `shadcn-react-table-core`, they will get all the additional capablities, utils etc. They will create the DataTable component with the `shadcn-react-table-cli` in their `ui/` folder. And that component will use components like buttons etc from their ui library, but they will get the additional features through the package

### Development Strategy
- Look into the code from original material-react-table package.
- Port each components from the top down approach.
- Mimic creating the root ShadcnReactTable component, that mimics the MaterialReactTable component. It will have similar child components for example: MRT_TableContainer -> SRT_TableContainer etc and so forth
- Use shadcn components or simple tailwind stylings as you see fit
- Add utils, icons, types to the core package if necessary
- For all the parts that will be skipped (e.g. a mui related type that needs to ported later, or a component that we haven't created yet), add commented codes with TODO prefix. Keep the coding style similar to the original package

Components to port:

