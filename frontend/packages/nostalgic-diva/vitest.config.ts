import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// `e2e/` holds Playwright specs; run those with `pnpm test:e2e`.
		include: ['test/**/*.test.{ts,tsx}'],
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
});
