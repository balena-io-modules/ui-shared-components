import { createContext } from 'react';
import type { TFunction } from '../hooks/useTranslations';
export interface UiSharedComponentsContextProviderInterface {
	history: unknown;
	t?: TFunction;
	externalTranslationMap?: Dictionary<string>;
}

export const UiSharedComponentsContextProvider =
	createContext<UiSharedComponentsContextProviderInterface>({
		history: {},
	});

export const UiSharedComponentsProvider = ({
	children,
	...otherProps
}: UiSharedComponentsContextProviderInterface & {
	children: React.ReactNode;
}) => {
	return (
		<UiSharedComponentsContextProvider.Provider value={otherProps}>
			{children}
		</UiSharedComponentsContextProvider.Provider>
	);
};
