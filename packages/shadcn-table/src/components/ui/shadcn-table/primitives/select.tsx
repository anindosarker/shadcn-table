// Development indirection only: `#primitives/*` (package.json `imports`)
// resolves to ./radix/* by default and to ./base/* under the `st-base`
// condition that `ST_BASE=base` sets (vite.config.ts, tsconfig.base.json).
// The registry items ship the chosen implementation at this path instead.
export * from '#primitives/select';
