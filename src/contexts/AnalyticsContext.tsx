import {
	AnalyticsUrlParams,
	createMarketingClient,
	createWebTracker,
	WebTracker,
} from 'analytics-client';
import { createContext, useContext, useReducer } from 'react';

export enum AnalyticsStoreActions {
	setAnalyticsData = 'set_analytics_data',
}

type AnalyticsActionPayload = {
	endpoint: string;
	projectName: string;
	componentName: string;
	componentVersion: string;
	trackerName: string;
} | null;

type Action = {
	type: AnalyticsStoreActions.setAnalyticsData;
	payload: AnalyticsActionPayload;
};

type Dispatch = (action: Action) => void;

type AnalyticsContext = {
	webTracker: WebTracker | null;
	urlParamsHandler: AnalyticsUrlParams | null;
	trackBalenaNavigation: (url: string) => string;
};

const AnalyticsStateContext = createContext<
	| {
			state: AnalyticsContext;
			dispatch: Dispatch;
	  }
	| undefined
>(undefined);

const initialContext: AnalyticsContext = {
	webTracker: null,
	urlParamsHandler: null,
	trackBalenaNavigation: (url) => url,
};

const contextReducer = (state: AnalyticsContext, { type, payload }: Action) => {
	switch (type) {
		case AnalyticsStoreActions.setAnalyticsData: {
			console.log('payload', payload);
			if (!payload) {
				return state;
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
					window.location.pathname + (!!newQuery ? `?${newQuery}` : '');
				window.history.replaceState(null, '', newUrl);
			}
			const analyticsClient = createMarketingClient({
				endpoint: payload.endpoint,
				projectName: payload.projectName,
				componentName: payload.componentName,
				deviceId: urlParamsHandler.getPassedDeviceId(),
				componentVersion: payload.componentVersion,
			});

			const webTracker =
				analyticsClient && payload && 'trackerName' in payload
					? createWebTracker(analyticsClient, payload.trackerName)
					: null;

			if (analyticsClient) {
				urlParamsHandler.setClient(analyticsClient);
			}

			return {
				...state,
				webTracker,
				urlParamsHandler,
				trackBalenaNavigation,
			};
		}
		default: {
			throw new Error(`Unhandled action type: ${type}`);
		}
	}
};

export const AnalyticsContextProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(contextReducer, initialContext);
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
