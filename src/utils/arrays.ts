export const uniq = <T>(arr: T[]): T[] => {
	return Array.from(new Set(arr));
};

export const toArray = <T>(v: T | T[] | null | undefined): T[] => {
	return v == null ? [] : Array.isArray(v) ? v : [v];
};
