import { promises } from 'fs';
import packageJson from '../package.json';

const fontAwesomeRequireToken = [
	'@fortawesome/pro-duotone-svg-icons',
	'@fortawesome/pro-light-svg-icons',
	'@fortawesome/pro-regular-svg-icons',
	'@fortawesome/pro-solid-svg-icons',
];

(async () => {
	const fontAwesomeToken = process.env.FONTAWESOME_TOKEN;
	const packageJsonPath = '../package.json';

	if (fontAwesomeToken) {
		return;
	}

	console.warn(
		'[WARN]: FONTAWESOME_TOKEN is not set. Skipping installation of dependencies requiring the token.',
	);

	fontAwesomeRequireToken.forEach((lib) => {
		delete packageJson.dependencies[lib];
	});

	await promises.writeFile(
		packageJsonPath,
		JSON.stringify(packageJson),
		'utf8',
	);
})();
