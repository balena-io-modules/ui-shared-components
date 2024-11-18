// Exceptions would only happen if `localStorage` is not supported, which is not the case for the browers we support. We still, however, want to report such exception so we are aware if that happens in the wild.
export const getFromLocalStorage = <T>(key: string): T | undefined => {
	try {
		const val = localStorage.getItem(key);
		if (val != null) {
			return JSON.parse(val);
		}

		return undefined;
	} catch (err) {
		console.error('getFromLocalStorage ', err);
	}
};

export const setToLocalStorage = (key: string, value: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (err) {
		console.error('setToLocalStorage ', err);
	}
};

export const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.error('removeFromLocalStorage ', err);
	}
};
