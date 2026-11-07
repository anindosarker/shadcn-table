# Docs layout decisions, v0.9.x

Accepted decisions for the docs site restructuring, discussed in the "v0.9" session. Numbered `L<n>` so they never collide with the cycle's `D<n>` items; the epic that implements them cites them as `(docs-layout L<n>)`. Research: `docs-layout-research.md`.

## Round 1: discussion, 2026-11-05

### L1 Nav order is Docs, Examples, Guides, API Reference

- Today the order is getting-started, api, examples, guides in the sidebar root (`content/docs/meta.json:3-8`), the top nav (`lib/layout.shared.tsx:8-13`), the home nav (`components/dev-home/v12/nav.tsx:12-15`) and the footer (`components/dev-home/v12/footer.tsx:16-19`).
- New order in all four places: Docs (Getting Started: introduction, install, usage, agents), Examples, Guides, API Reference. `lib/routes.ts` follows the same order.
- Owner accepted 2026-11-08.
