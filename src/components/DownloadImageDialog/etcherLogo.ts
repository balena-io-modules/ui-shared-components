// Inlined so the asset ships with the tsc build (public/ is not published).
const toDataUri = (svg: string) =>
	`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// Used for the item in the dropdown menu.
export const etcherLogo = toDataUri(
	`<svg width="497" height="520" viewBox="0 0 497 520" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.000421524" width="496.407" height="520" rx="38.4814" fill="#4E5814"/><path d="M353.209 170.318V117.383H141.813V354.199H202.219V407.117H353.209V354.182H202.253V282.629H341.41V231.136H202.253V170.318H353.209Z" fill="#FBF4EE"/></svg>`,
);

// Used when the item is the main action of the button.
export const etcherLogoMain = toDataUri(
	`<svg width="497" height="520" viewBox="0 0 497 520" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.000421524" width="496.407" height="520" rx="38.4814" fill="#FBF4EE"/><path d="M353.209 170.318V117.383H141.813V354.199H202.219V407.117H353.209V354.182H202.253V282.629H341.41V231.136H202.253V170.318H353.209Z" fill="#27212A"/></svg>`,
);
