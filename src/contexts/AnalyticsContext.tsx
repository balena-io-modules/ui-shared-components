import {
	AnalyticsUrlParams,
	createMarketingClient,
	createWebTracker,
	WebTracker,
} from 'analytics-client';
import { createContext, useContext, useReducer } from 'react';

export enum StoreActions {
	setAnalyticsData = 'set_device_types',
}

type AnalyticsActionPayload = {
	endpoint: string;
	projectName: string;
	componentName: string;
	componentVersion: string;
	trackerName: string;
} | null;

type Action = {
	type: StoreActions.setAnalyticsData;
	payload: AnalyticsActionPayload;
};

type Dispatch = (action: Action) => void;

type AnalyticsContext = {
	webTracker: WebTracker | null;
	urlParamsHandler: AnalyticsUrlParams;
	trackBalenaNavigation: (url: string) => string;
};

type AnalyticsContextProviderProps = NonNullable<AnalyticsActionPayload>;

const AnalyticsStateContext = createContext<
	| {
			state: AnalyticsContext;
			dispatch: Dispatch;
	  }
	| undefined
>(undefined);

const urlParamsHandler = new AnalyticsUrlParams();
const trackBalenaNavigation = (url: string) => {
	const baseUrl = new URL(url);
	const deviceIdQuery = initialContext.urlParamsHandler.getQueryString(baseUrl);
	if (!baseUrl.search) {
		baseUrl.search = deviceIdQuery;
	} else {
		baseUrl.search = baseUrl.search + `&${deviceIdQuery}`;
	}

	return baseUrl.toString();
};

const initialContext: AnalyticsContext = {
	webTracker: null,
	urlParamsHandler,
	trackBalenaNavigation,
};

const contextReducer = (state: AnalyticsContext, { type, payload }: Action) => {
	switch (type) {
		case StoreActions.setAnalyticsData: {
			const newQuery =
				initialContext.urlParamsHandler.consumeUrlParameters(
					window.location.search,
				) ?? null;

			if (newQuery != null) {
				const newUrl =
					window.location.pathname + (!!newQuery ? `?${newQuery}` : '');
				window.history.replaceState(null, '', newUrl);
			}
			const analyticsClient =
				payload &&
				'endpoint' in payload &&
				'projectName' in payload &&
				'componentName' in payload &&
				'componentVersion' in payload
					? createMarketingClient({
							endpoint: payload.endpoint,
							projectName: payload.projectName,
							componentName: payload.componentName,
							deviceId: initialContext.urlParamsHandler.getPassedDeviceId(),
							componentVersion: payload.componentVersion,
					  })
					: null;

			const webTracker =
				analyticsClient && payload && 'trackerName' in payload
					? createWebTracker(analyticsClient, payload.trackerName)
					: null;

			if (analyticsClient) {
				initialContext.urlParamsHandler.setClient(analyticsClient);
			}

			return {
				...state,
				webTracker,
				urlParamsHandler: initialContext.urlParamsHandler,
				trackBalenaNavigation,
			};
		}
		default: {
			throw new Error(`Unhandled action type: ${type}`);
		}
	}
};

export const AnalyticsContextProvider: React.FC<
	React.PropsWithChildren<AnalyticsContextProviderProps>
> = ({ children }) => {
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
