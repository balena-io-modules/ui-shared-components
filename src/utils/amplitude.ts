export const getHasGuidesAndSurveysEnabled = () => {
	return window.engagement.gs.list() !== undefined;
};
