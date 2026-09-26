// Generates catalog.json from the workspace catalog, so the catalog can be
// published as @aigamo/catalog and consumed by other repos.
//
// Source of truth: frontend/pnpm-workspace.yaml — this file only snapshots it.
// Runs on `pnpm build`. Not a `prepack` hook: lifecycle output would corrupt
// the `pnpm publish --json` output that `nx release publish` parses.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const workspacePath = resolve(here, '../../pnpm-workspace.yaml');

const workspace = parse(readFileSync(workspacePath, 'utf8')) ?? {};

const output = {
	catalog: workspace.catalog ?? {},
	...(workspace.catalogs ? { catalogs: workspace.catalogs } : {}),
};

writeFileSync(
	resolve(here, 'catalog.json'),
	`${JSON.stringify(output, null, '\t')}\n`,
);

console.log(
	`Wrote catalog.json (${Object.keys(output.catalog).length} default catalog entries).`,
);
