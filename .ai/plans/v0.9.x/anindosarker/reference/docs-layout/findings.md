# Docs layout findings, v0.9.x

Problems found in the docs site while discussing the restructuring. Numbered `LF<n>`; the epic that fixes one cites it as `(docs-layout LF<n>)`. Paths under `apps/shadcn-table-docs/`.

### LF1 The home footer's Storybook link ignores the selected base

- `components/dev-home/v12/footer.tsx:40-41` always uses `storybookUrl.radix`; `StorybookLink` (`components/mdx/storybook-link.tsx:24-35`) follows the selected base everywhere else.

### LF2 The example playground names a "Both" mode it never offers

- `components/example-playground.tsx:69-70` and the brief say Preview, Code and Both; the tab list at :128 has Preview and Code only.

### LF3 Two hand-kept route lists

- `content/docs/*/meta.json` drives the sidebar; `lib/routes.ts:11` is a second list (examples block :107, Storybook entry :392) feeding `TableOfContentsList` on `examples/index.mdx:10-12`. A new page must be added to both.
