import { useMemo } from 'react';

export const useRandomUUID = (): string => {
	const generateUUID = () => {
		if (typeof crypto?.randomUUID === 'function') {
			return crypto.randomUUID();
		}

		const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		return template.replace(/x/g, () =>
			Math.floor(Math.random() * 16).toString(16),
		);
	};

	return useMemo(() => generateUUID(), []);
};
