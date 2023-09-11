import * as React from 'react';

type CookieObject = {
	title: string;
	description: string;
	value: boolean;
	required?: boolean;
};

type StoredCookies = {
	[key: string]: CookieObject;
};

export enum CookiesStoreActions {
	setCookies = 'set_cookies',
}

type Action = {
	type: CookiesStoreActions.setCookies;
	payload: StoredCookies | undefined;
};

type Dispatch = (action: Action) => void;

const CookiesContext = React.createContext<
	{ state: StoredCookies; dispatch: Dispatch } | undefined
>(undefined);

const contextReducer = (state: StoredCookies, { type, payload }: Action) => {
	switch (type) {
		case CookiesStoreActions.setCookies: {
			return { ...state, ...payload };
		}
		default: {
			throw new Error(`Unhandled action type: ${type}`);
		}
	}
};

export const CookiesContextProvider = ({
	children,
	cookies,
}: React.PropsWithChildren<{ cookies: StoredCookies }>) => {
	const [state, dispatch] = React.useReducer(contextReducer, cookies);
	const value = { state, dispatch };
	return (
		<CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>
	);
};

export const useCookiesContext = () => {
	const context = React.useContext(CookiesContext);
	if (context === undefined) {
		throw new Error('useCookiesContext must be used within a ContextProvider');
	}
	return context;
};
