import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
	baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export default [
	...fixupConfigRules(
		compat.config({
			extends: ['./.eslintrc.cjs'],
		}),
	),
];
