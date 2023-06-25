import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		react({
			// https://dev.to/ajitsinghkamal/using-emotionjs-with-vite-2ndj#comment-1nif3
			jsxImportSource: '@emotion/react',
		}),
	],
	build: {
		// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
	// https://www.asobou.co.jp/blog/web/github-pages
	base: process.env.NODE_ENV === 'production' ? '/hydrangean-diva/' : './',
});
