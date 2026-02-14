module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['dist'],
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			plugins: [
				'@typescript-eslint/eslint-plugin',
				'import',
				'boundaries',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
				'react-app',
				'plugin:boundaries/recommended',
			],
			settings: {
				'import/resolver': {
					typescript: {
						alwaysTryTypes: true,
					},
				},
				'boundaries/elements': [
					{
						type: '@aigamo.hydrangean-diva/common',
						pattern: 'src/features/common/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.header',
						pattern: 'src/features/media-player.header/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
						pattern:
							'src/features/media-player.play-queue.abstractions/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.play-queue',
						pattern: 'src/features/media-player.play-queue/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.player.abstractions',
						pattern:
							'src/features/media-player.player.abstractions/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.player',
						pattern: 'src/features/media-player.player/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.bottom-bar.abstractions',
						pattern:
							'src/features/media-player.bottom-bar.abstractions/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.bottom-bar',
						pattern: 'src/features/media-player.bottom-bar/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.mini-player.abstractions',
						pattern:
							'src/features/media-player.mini-player.abstractions/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.mini-player',
						pattern: 'src/features/media-player.mini-player/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.playlists.abstractions',
						pattern:
							'src/features/media-player.playlists.abstractions/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player.playlists',
						pattern: 'src/features/media-player.playlists/**',
					},
					{
						type: '@aigamo.hydrangean-diva/media-player',
						pattern: 'src/features/media-player/**',
					},
				],
			},
			rules: {
				'@typescript-eslint/interface-name-prefix': 'off',
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-floating-promises': 'error',
				'no-restricted-imports': [
					'error',
					{
						patterns: [
							{
								group: ['./*', '../*'],
								message:
									'Relative imports are not allowed. Use absolute imports.',
							},
						],
					},
				],
				'import/no-internal-modules': [
					'error',
					{
						forbid: [
							'**/index',
							'**/index.ts',
							'**/index.tsx',
							'**/index.js',
							'**/index.jsx',
						],
					},
				],
				'boundaries/element-types': [
					2,
					{
						default: 'disallow',
						rules: [
							{
								from: '@aigamo.hydrangean-diva/common',
								disallow: ['*'],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.header',
								allow: ['@aigamo.hydrangean-diva/common'],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
								allow: [],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.play-queue',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
									'@aigamo.hydrangean-diva/media-player.playlists.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.player.abstractions',
								allow: [],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.player',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.player.abstractions',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.bottom-bar.abstractions',
								allow: [
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.bottom-bar',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.bottom-bar.abstractions',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
									'@aigamo.hydrangean-diva/media-player.player.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.mini-player.abstractions',
								allow: [
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.mini-player',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.bottom-bar.abstractions',
									'@aigamo.hydrangean-diva/media-player.mini-player.abstractions',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
									'@aigamo.hydrangean-diva/media-player.player.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.playlists.abstractions',
								allow: [
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player.playlists',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
									'@aigamo.hydrangean-diva/media-player.play-queue',
									'@aigamo.hydrangean-diva/media-player.playlists.abstractions',
								],
							},
							{
								from: '@aigamo.hydrangean-diva/media-player',
								allow: [
									'@aigamo.hydrangean-diva/common',
									'@aigamo.hydrangean-diva/media-player.bottom-bar',
									'@aigamo.hydrangean-diva/media-player.mini-player',
									'@aigamo.hydrangean-diva/media-player.play-queue.abstractions',
									'@aigamo.hydrangean-diva/media-player.play-queue',
									'@aigamo.hydrangean-diva/media-player.player',
									'@aigamo.hydrangean-diva/media-player.playlists',
								],
							},
						],
					},
				],
			},
		},
	],
};
