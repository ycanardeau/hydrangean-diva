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
			],
			settings: {
				'import/resolver': {
					typescript: {
						alwaysTryTypes: true,
					},
				},
				// Architectural layers. Order matters: the first matching
				// descriptor wins. `feature` captures the feature folder name so
				// that a feature may only import from itself (see rules below).
				'boundaries/elements': [
					{ type: 'app', mode: 'full', pattern: 'src/*.{ts,tsx}' },
					{ type: 'shared', mode: 'folder', pattern: 'src/shared' },
					{ type: 'layout', mode: 'folder', pattern: 'src/layout' },
					{ type: 'routes', mode: 'folder', pattern: 'src/routes' },
					{
						type: 'feature',
						mode: 'folder',
						pattern: 'src/features/(*)',
						capture: ['feature'],
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
				// Enforce the dependency direction between layers.
				// app -> anything; layout/routes -> features + shared;
				// a feature -> shared + itself only; shared -> shared.
				'boundaries/dependencies': [
					2,
					{
						default: 'disallow',
						rules: [
							{
								from: { type: 'app' },
								allow: {
									to: {
										type: [
											'app',
											'layout',
											'routes',
											'feature',
											'shared',
										],
									},
								},
							},
							{
								from: { type: 'layout' },
								allow: {
									to: {
										type: ['layout', 'feature', 'shared'],
									},
								},
							},
							{
								from: { type: 'routes' },
								allow: {
									to: {
										type: [
											'routes',
											'layout',
											'feature',
											'shared',
										],
									},
								},
							},
							{
								from: { type: 'feature' },
								allow: {
									to: [
										{ type: 'shared' },
										{
											type: 'feature',
											captured: {
												feature: '{{ from.captured.feature }}',
											},
										},
									],
								},
							},
							{
								from: { type: 'shared' },
								allow: { to: { type: 'shared' } },
							},
						],
					},
				],
			},
		},
	],
};
