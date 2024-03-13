import util from 'util';
import { exec } from 'child_process';

export const logError = (...args: any) => {
	console.error('\x1b[31m%s\x1b[0m', ...args);
};

export const run = async (cmd: string) => {
	const execAsync = util.promisify(exec);
	try {
		const { stdout, stderr } = await execAsync(cmd, { encoding: 'utf8' });
		console.log(stdout);
		logError(stderr);
		return { stdout, stderr };
	} catch (e) {
		logError(e);
		return process.exit(1);
	}
};
