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
			plugins: ['@typescript-eslint/eslint-plugin'],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
				'react-app',
			],
			settings: {
				'import/resolver': {
					typescript: {
						alwaysTryTypes: true,
					},
				},
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
			},
		},
	],
};
