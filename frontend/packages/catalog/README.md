# @aigamo/catalog

The shared [pnpm catalog](https://pnpm.io/catalogs) for `@aigamo` projects.

`catalog.json` is **generated** from
[`frontend/pnpm-workspace.yaml`](../../pnpm-workspace.yaml) — that workspace file
is the single source of truth. This package just snapshots the catalog so other
repositories can consume the same dependency versions.

## Shape

```jsonc
{
  "catalog": { "react": "^18.3.1", "vite": "^8.3.0", /* ... */ },
  "catalogs": { /* named catalogs, if any */ }
}
```

## Consuming it

Add it as a dev dependency and read `@aigamo/catalog/catalog.json` in a sync
script that writes the `catalog:` block of your own `pnpm-workspace.yaml`
(merging any project-specific entries on top). See the consuming repo's
`scripts/sync-catalog.mjs`.

## Regenerating locally

```bash
pnpm --filter @aigamo/catalog build
```

Runs automatically on `prepack`, so a publish always ships the current catalog.
