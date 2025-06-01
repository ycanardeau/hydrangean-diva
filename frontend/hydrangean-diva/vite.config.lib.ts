import pkg from './package.json' assert { type: 'json' };
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		dts({
			insertTypesEntry: true,
		}),
		react({
			jsxRuntime: 'classic',
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
