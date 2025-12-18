import * as React from 'react';
import dayjs from 'dayjs';

const getBrowserBaseLocale = (fallback = 'en') => {
	const lang = navigator.language || fallback;
	return lang.toLowerCase().split('-')[0];
};

const loaded = new Set<string>();

async function ensureDayjsLocale(locale: string) {
	if (loaded.has(locale)) {
		return;
	}
	await import(`dayjs/locale/${locale}.js`);

	loaded.add(locale);
}

export function useDayjsAdapterLocale(fallback = 'en') {
	const [adapterLocale, setAdapterLocale] = React.useState(fallback);

	React.useEffect(() => {
		const browserLocale = getBrowserBaseLocale(fallback);

		void (async () => {
			try {
				await ensureDayjsLocale(browserLocale);
				dayjs.locale(browserLocale);
				setAdapterLocale(browserLocale);
			} catch {
				dayjs.locale(fallback);
				setAdapterLocale(fallback);
			}
		})();
	}, [fallback]);

	return adapterLocale;
}
