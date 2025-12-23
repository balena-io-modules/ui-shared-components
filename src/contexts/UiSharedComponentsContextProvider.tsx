import { createContext } from 'react';
import type { TFunction } from '../hooks/useTranslations';
import type { NavigateFunction } from 'react-router-dom';
import type { Format } from '../components/RJST/components/Widget/utils';
export interface UiSharedComponentsContextProviderInterface {
	navigate?: NavigateFunction;
	t?: TFunction;
	externalTranslationMap?: Dictionary<string>;
	RJSTFormats?: Format[];
}

export const UiSharedComponentsContextProvider =
	createContext<UiSharedComponentsContextProviderInterface>({
		navigate: undefined,
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
