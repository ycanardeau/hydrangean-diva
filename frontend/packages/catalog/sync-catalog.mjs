#!/usr/bin/env node
// Shipped by @aigamo/catalog as the `aigamo-sync-catalog` bin.
//
// Brings the consuming repo's pnpm-workspace.yaml `catalog:` block up to the
// shared versions in this package's `catalog.json` snapshot, so every repo uses
// the same dependency versions.
//
// It only touches deps the repo actually uses — a dep is "used" if it is
// already listed in the consumer's catalog, or referenced via `catalog:` in any
// package.json. That way a repo never accumulates shared entries it doesn't use.
//
// Rules:
//   - For every used dep the shared catalog knows about, take the shared version
//     (added if missing, updated if it differs).
//   - Shared deps the repo doesn't use are NOT added.
//   - Project-specific entries (ones the shared catalog does not have) are kept.
//   - Nothing is ever removed; minimumReleaseAge, allowBuilds, packages,
//     ordering and comments are left untouched.
//
// Usage:
//   pnpm dlx @aigamo/catalog      sync this repo's catalog, then `pnpm install`
//   aigamo-sync-catalog           same, if installed as a dependency
//   aigamo-sync-catalog --check   report drift only, write nothing; exits
//                                 non-zero when out of sync (for CI)

import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseDocument } from 'yaml';

const checkOnly = process.argv.slice(2).includes('--check');

function fail(message) {
	console.error(`aigamo-sync-catalog: ${message}`);
	process.exit(1);
}

// This package's own catalog.json, co-located with this script.
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const sharedCatalog = require(resolve(here, 'catalog.json')).catalog ?? {};

// Prefer INIT_CWD (the dir the command was invoked from) so we find the
// consumer workspace even when run from the package store via `pnpm dlx`.
const start = process.env.INIT_CWD || process.cwd();
const wsPath = findWorkspaceFile(start);
if (!wsPath) {
	fail(
		`no pnpm-workspace.yaml found above ${start}\n` +
			'Create one with a `catalog:` line, then run this again.',
	);
}

const doc = parseDocument(readFileSync(wsPath, 'utf8'));
// Create the catalog block if the consumer doesn't have one yet.
if (!doc.has('catalog')) doc.set('catalog', doc.createNode({}));
const catalog = doc.get('catalog');

// A dep is "used" if it is already in the catalog, or referenced via `catalog:`
// somewhere in the workspace.
const used = new Set(catalog.items.map((i) => String(i.key)));
for (const name of collectCatalogRefs(dirname(wsPath))) used.add(name);

const added = [];
const bumped = [];
const unresolved = [];
for (const name of used) {
	if (!(name in sharedCatalog)) {
		// Referenced via catalog: but neither in the catalog nor shared — the
		// consumer has to supply it. Flag it; never touch it.
		if (!catalog.has(name)) unresolved.push(name);
		continue;
	}
	const next = sharedCatalog[name];
	if (!catalog.has(name)) {
		added.push(`  ${name}: ${next}`);
		if (!checkOnly) insertSorted(catalog, name, next);
	} else if (String(catalog.get(name)) !== next) {
		bumped.push(`  ${name}: ${catalog.get(name)} -> ${next}`);
		if (!checkOnly) catalog.set(name, next);
	}
}

const changes = added.length + bumped.length;

function report() {
	if (added.length) console.log(`added:\n${added.join('\n')}`);
	if (bumped.length) console.log(`changed:\n${bumped.join('\n')}`);
	if (unresolved.length) {
		console.log(
			`\nreferenced via \`catalog:\` but not in @aigamo/catalog — add a ` +
				`version yourself:\n  ${unresolved.join(', ')}`,
		);
	}
}

if (checkOnly) {
	if (!changes) {
		console.log('@aigamo/catalog: catalog is in sync.');
		report();
		process.exit(0);
	}
	console.log(`@aigamo/catalog: ${changes} entries out of sync:`);
	report();
	console.log('\nRun `pnpm dlx @aigamo/catalog && pnpm install` to apply.');
	process.exit(1);
}

if (!changes) {
	console.log('@aigamo/catalog: already in sync.');
	report();
	process.exit(0);
}

writeFileSync(wsPath, doc.toString({ singleQuote: true }));
console.log(`@aigamo/catalog: updated ${changes} entries in ${wsPath}`);
report();
console.log('\nRun `pnpm install` to apply.');

// Add a new catalog entry, keeping the block's existing ordering: the key is
// placed before the first existing key that sorts after it. On an already-sorted
// catalog this keeps it sorted; otherwise it just appends near the end.
function insertSorted(map, key, value) {
	map.set(key, value); // appends the new pair
	const pair = map.items.pop();
	let i = map.items.findIndex((item) => String(item.key) > key);
	if (i < 0) i = map.items.length;
	map.items.splice(i, 0, pair);
}

// Walk up from a starting directory to find the consumer workspace file.
function findWorkspaceFile(startDir) {
	let dir = startDir;
	for (;;) {
		const candidate = resolve(dir, 'pnpm-workspace.yaml');
		if (existsSync(candidate)) return candidate;
		const parent = dirname(dir);
		if (parent === dir) return null;
		dir = parent;
	}
}

// Collect every dependency name referenced with the default `catalog:` protocol
// across the workspace's package.json files.
function collectCatalogRefs(rootDir) {
	const names = new Set();
	const fields = [
		'dependencies',
		'devDependencies',
		'peerDependencies',
		'optionalDependencies',
	];
	(function walk(dir) {
		let entries;
		try {
			entries = readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
			const full = resolve(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.name === 'package.json') {
				let pkg;
				try {
					pkg = JSON.parse(readFileSync(full, 'utf8'));
				} catch {
					continue;
				}
				for (const field of fields) {
					const deps = pkg[field];
					if (!deps) continue;
					for (const [name, spec] of Object.entries(deps)) {
						// `catalog:` and `catalog:default` are the default catalog;
						// `catalog:<other>` points at a named catalog we don't manage.
						if (spec === 'catalog:' || spec === 'catalog:default') {
							names.add(name);
						}
					}
				}
			}
		}
	})(rootDir);
	return names;
}
