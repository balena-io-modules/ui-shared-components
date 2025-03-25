import type { Client, WebTracker } from 'analytics-client';
import { AnalyticsUrlParams, createWebTracker } from 'analytics-client';
import { createContext, useContext, useEffect, useReducer } from 'react';

export enum AnalyticsStoreActions {
	setAnalyticsData = 'set_analytics_data',
}
type AnalyticsActionPayload = {
	trackerName: string;
	createAnalyticsClient: (urlParamsHandler: AnalyticsUrlParams) => Client;
	featureFlags?: Dictionary<boolean> | null;
} | null;

type Action = {
	type: AnalyticsStoreActions.setAnalyticsData;
	payload: AnalyticsActionPayload | AnalyticsContext;
};

type Dispatch = (action: Action) => void;

type AnalyticsContext = {
	analyticsClient: Client | null;
	webTracker: WebTracker | null;
	featureFlags: Dictionary<boolean> | null;
	urlParamsHandler?: AnalyticsUrlParams | null;
	trackBalenaNavigation?: (url: string) => string;
};

const AnalyticsStateContext = createContext<
	| {
			state: AnalyticsContext;
			dispatch: Dispatch;
	  }
	| undefined
>(undefined);

const initialContext: AnalyticsContext = {
	analyticsClient: null,
	webTracker: null,
	urlParamsHandler: null,
	featureFlags: null,
	trackBalenaNavigation: (url) => url,
};

const contextReducer = (state: AnalyticsContext, { type, payload }: Action) => {
	const featureFlags = payload?.featureFlags ?? state.featureFlags ?? null;
	switch (type) {
		case AnalyticsStoreActions.setAnalyticsData: {
			if (!payload || state.analyticsClient) {
				return {
					...state,
					featureFlags,
				};
			}
			const urlParamsHandler = new AnalyticsUrlParams();
			const trackBalenaNavigation = (url: string) => {
				const baseUrl = new URL(url);
				const deviceIdQuery = urlParamsHandler.getQueryString(baseUrl);
				if (!baseUrl.search) {
					baseUrl.search = deviceIdQuery;
				} else {
					baseUrl.search = baseUrl.search + `&${deviceIdQuery}`;
				}

				return baseUrl.toString();
			};
			const newQuery =
				urlParamsHandler.consumeUrlParameters(window.location.search) ?? null;

			if (newQuery != null) {
				const newUrl =
					window.location.pathname + (newQuery ? `?${newQuery}` : '');
				window.history.replaceState(null, '', newUrl);
			}
			const analyticsClient =
				'analyticsClient' in payload
					? payload.analyticsClient
					: payload.createAnalyticsClient(urlParamsHandler);

			const webTracker =
				'webTracker' in payload
					? payload.webTracker
					: analyticsClient && payload && 'trackerName' in payload
						? createWebTracker(analyticsClient, payload.trackerName)
						: null;

			if (analyticsClient) {
				urlParamsHandler.setClient(analyticsClient);
			}

			return {
				...state,
				analyticsClient,
				webTracker,
				urlParamsHandler,
				featureFlags,
				trackBalenaNavigation,
			};
		}
		default: {
			throw new Error(`Unhandled action type: ${type}`);
		}
	}
};

interface AnalyticsContextProviderProps {
	initialState?: AnalyticsContext;
}

export const AnalyticsContextProvider = ({
	initialState,
	children,
}: React.PropsWithChildren<AnalyticsContextProviderProps>) => {
	const [state, dispatch] = useReducer(contextReducer, initialContext);
	useEffect(() => {
		if (initialState) {
			dispatch({
				type: AnalyticsStoreActions.setAnalyticsData,
				payload: initialState,
			});
		}
	}, [initialState]);
	const value = { state, dispatch };
	return (
		<AnalyticsStateContext.Provider value={value}>
			{children}
		</AnalyticsStateContext.Provider>
	);
};

export const useAnalyticsContext = () => {
	const context = useContext(AnalyticsStateContext);
	if (context === undefined) {
		throw new Error(
			'useAnalyticsContext must be used within a ContextProvider',
		);
	}
	return context;
};
