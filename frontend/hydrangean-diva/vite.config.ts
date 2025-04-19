import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

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
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'sw.ts',
			registerType: 'autoUpdate',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'Hydrangean Diva',
				short_name: 'Hydrangean Diva',
				description: '',
				theme_color: '#ffffff',
				// https://stackoverflow.com/a/78560070
				scope: '/hydrangean-diva',
				share_target: {
					action: '/#/share-target',
					method: 'GET',
					enctype: 'application/x-www-form-urlencoded',
					params: {
						title: 'title',
						text: 'text',
						url: 'url',
					},
				},
			},

			injectManifest: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				// https://vite-pwa-org.netlify.app/guide/faq.html#missing-assets-from-sw-precache-manifest
				maximumFileSizeToCacheInBytes: 3000000,
			},

			devOptions: {
				enabled: false,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
	build: {
		// https://github.com/elastic/eui/issues/5463#issuecomment-1107665339
		dynamicImportVarsOptions: {
			exclude: [],
		},
	},
	server: {
		port:
			process.env.PORT !== undefined
				? parseInt(process.env.PORT)
				: undefined,
	},
	// https://www.asobou.co.jp/blog/web/github-pages
	base: process.env.NODE_ENV === 'production' ? '/hydrangean-diva/' : './',
});
