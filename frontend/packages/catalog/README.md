# @aigamo/catalog

The shared [pnpm catalog](https://pnpm.io/catalogs) for `@aigamo` projects.

`catalog.json` is **generated** from
[`frontend/pnpm-workspace.yaml`](../../pnpm-workspace.yaml) — that workspace file
is the single source of truth. This package just snapshots the catalog so other
repositories can consume the same dependency versions.

## Consuming it

In any repo, run one command:

```bash
pnpm dlx @aigamo/catalog && pnpm install
```

That's it. It brings your `pnpm-workspace.yaml` `catalog:` block up to the
shared versions (creating the block if needed), then `pnpm install` applies
them. Run the same command again whenever you want to pick up newer versions.

It only touches deps your repo actually uses — a dep counts as used if it's
already in your catalog, or referenced via `catalog:` in any `package.json`:

- for each used dep, takes the shared version (adds if missing, updates if
  changed), so a fresh repo just needs to reference `catalog:` and sync,
- never adds shared deps you don't use,
- keeps your own project-specific entries,
- removes nothing; leaves `minimumReleaseAge`, `allowBuilds`, `packages`,
  ordering and comments untouched.

> Why a command and not automatic on install? pnpm doesn't run a dependency's
> install scripts unless you allow-list them, and a catalog change only takes
> effect on the next `pnpm install` anyway — so one explicit command is both
> simpler and less surprising.

### CI check (optional)

`pnpm dlx @aigamo/catalog --check` writes nothing and exits non-zero when your
catalog is out of sync, so CI can fail if someone forgot to run the sync. The
raw data is also exported at `@aigamo/catalog/catalog.json` if you'd rather
script it yourself.

## Regenerating locally

```bash
pnpm --filter @aigamo/catalog build
```

The publish workflow runs `pnpm build` before `nx release publish`, so a publish always ships the current catalog.
