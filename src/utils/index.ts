export type PartialDomRect = Partial<Omit<DOMRect, 'toJSON'>>;

export const getBoundingContainerRect = (
	element: EventTarget & HTMLDivElement,
): PartialDomRect | null => {
	if (!element) {
		return null;
	}
	const parent = (element.offsetParent as HTMLElement) ?? document.body;
	const top = element.offsetTop + parent.offsetTop;
	const left = element.offsetLeft + parent.offsetLeft;
	const height = element.clientHeight;
	const width = element.clientWidth;

	if (!parent || !top || !left || !height || !width) {
		return null;
	}
	return {
		top,
		bottom: top + height,
		left,
		right: left + width,
		height,
		width,
		x: top,
		y: left,
	};
};
