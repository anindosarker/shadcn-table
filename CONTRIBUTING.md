# Contributing

## Large changes

Open a GitHub issue to discuss a large change before starting a PR.

## Local setup

Local setup and every command live in [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md).

## Before a PR

```bash
pnpm --filter shadcn-table tsc
pnpm --filter shadcn-table lint
pnpm test
pnpm --filter shadcn-table-docs types:check
```

CI runs the same jobs.
