import { run } from './utils';

const validateChangeType = (maybeChangeType = 'patch') => {
	maybeChangeType = maybeChangeType.toLowerCase();
	switch (maybeChangeType) {
		case 'patch':
		case 'minor':
		case 'major':
			return maybeChangeType;
		default:
			console.error(`Invalid change type: '${maybeChangeType}'`);
			return process.exit(1);
	}
};

const getVersion = async (module: string): Promise<string> => {
	const { stdout } = await run(`npm ls --json --depth 0 ${module}`);
	return JSON.parse(stdout).dependencies[module].version;
};

const printUsage = () => {
	console.error(
		`Usage: npm run update $packageName $version [$changeType=minor]`,
	);
	return process.exit(1);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	if (process.argv.length < 3) {
		return printUsage();
	}

	const packageName = process.argv[2];
	const version = process.argv[3];

	const oldVersion = await getVersion(packageName);
	await run(`npm install ${packageName}@${version}`);
	const newVersion = await getVersion(packageName);
	if (newVersion === oldVersion) {
		console.error(`Already on version '${newVersion}'`);
		return process.exit(1);
	}

	console.log(`Updated ${packageName} from ${oldVersion} to ${newVersion}`);

	const changeType = process.argv[4]
		? // if the caller specified a change type, use that one
		  validateChangeType(process.argv[4])
		: 'patch';
	console.log(`Using Change-type: ${changeType}`);

	let { stdout: currentBranch } = await run('git rev-parse --abbrev-ref HEAD');
	currentBranch = currentBranch.trim();
	console.log(`Currenty on branch: '${currentBranch}'`);
	if (currentBranch === 'master') {
		await run(`git checkout -b "update-${packageName}-${newVersion}"`);
	}

	await run(`git add package.json package-lock.json`);
	await run(
		`git commit --message "Update ${packageName} to ${newVersion}" --message "Update ${packageName} from ${oldVersion} to ${newVersion}" --message "Changelog-entry: Update ${packageName}\nChange-type: ${changeType}"`,
	);
})();
