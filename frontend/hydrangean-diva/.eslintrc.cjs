module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		ecmaVersion: 'latest',
	},
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'simple-import-sort',
		'import',
		'boundaries',
	],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'react-app',
		'plugin:boundaries/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.cjs'],
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
		'boundaries/elements': [],
	},
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-floating-promises': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-duplicates': 'error',
		'boundaries/element-types': [
			2,
			{
				default: 'disallow',
				rules: [],
			},
		],
	},
};
