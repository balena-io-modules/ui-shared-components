// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
	baseDirectory: __dirname,
});
module.exports = [
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	...require('@balena/lint/config/eslint.config'),
	// See: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md#when-not-to-use-it
	...compat.config({ extends: 'plugin:react/jsx-runtime' }),
];
