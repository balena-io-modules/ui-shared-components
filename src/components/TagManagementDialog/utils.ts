export const stopKeyDownEvent = (
	e: React.KeyboardEvent<HTMLElement>,
	keyCode: number,
	handler?: () => void,
) => {
	if (!e.defaultPrevented && e.keyCode === keyCode) {
		e.preventDefault();
		e.stopPropagation();
		if (handler) {
			handler();
		}
	}
};

export const withPreventDefault =
	(fn: () => unknown) => (e?: React.FormEvent<HTMLElement>) => {
		if (e?.preventDefault) {
			e.preventDefault();
		}
		return fn();
	};

export const stopEvent = (event: React.MouseEvent<HTMLElement>) => {
	event.preventDefault();
	event.stopPropagation();
};
