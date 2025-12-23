export const isObjectEmpty = (
	obj: Record<string, unknown> | object,
): boolean => {
	return Object.keys(obj).length === 0;
};

/**
 * Native replacement for Lodash's deep pick.
 * Accepts an object and an array of paths (string arrays).
 */
export const pickDeep = (source: any, paths: string[][]) => {
	const result: any = {};

	for (const path of paths) {
		// 1. Get the value deep inside the source
		//    (Using reduce to walk down the tree: source.prop.nested.val)
		const value = path.reduce((acc, key) => acc?.[key], source);

		// 2. If found, rebuild that path in the 'result' object
		if (value !== undefined) {
			let current = result;
			path.forEach((key, index) => {
				// If it's the last key, set the value
				if (index === path.length - 1) {
					current[key] = value;
				} else {
					// Otherwise, ensure the container object exists
					current[key] ??= {};
					current = current[key];
				}
			});
		}
	}
	return result;
};

export const get = <T = any>(
	obj: any,
	path: string | string[],
	defaultValue?: T,
): T | undefined => {
	let result;
	// 1. Handle array path ['a', 'b'] directly
	if (Array.isArray(path)) {
		result = path.reduce((acc, key) => acc?.[key], obj);
		return result !== undefined ? result : defaultValue;
	}

	// 2. Handle string path 'a[0].b' -> 'a.0.b'
	//    This regex converts brackets to dots so we can split easily
	const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');

	// 3. Traverse
	result = normalizedPath.split('.').reduce((acc, key) => acc?.[key], obj);

	return result !== undefined ? result : defaultValue;
};
