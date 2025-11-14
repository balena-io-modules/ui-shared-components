export const isObjectEmpty = (
	obj: Record<string, unknown> | object,
): boolean => {
	return Object.keys(obj).length === 0;
};
