import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

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
		react(),
		externalizeDeps(),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
		sourcemap: true,
	},
});
