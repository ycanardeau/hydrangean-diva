import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// eslint-disable-next-line no-restricted-imports
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		dts({
			// https://github.com/qmhc/unplugin-dts/blob/708056e3ec6444ba3feb2b444bdecf53ac75b152/README.md
			tsconfigPath: './tsconfig.app.json',
			insertTypesEntry: true,
		}),
		react({
			// https://dev.to/ajitsinghkamal/using-emotionjs-with-vite-2ndj#comment-1nif3
			jsxImportSource: '@emotion/react',
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: [
				...Object.keys(pkg.peerDependencies ?? []),
				...Object.keys(pkg.dependencies ?? []),
			],
		},
		sourcemap: true,
		// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
	server: {},
});
