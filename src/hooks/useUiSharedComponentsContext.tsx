import React from 'react';
import { UiSharedComponentsContextProvider } from '../contexts/UiSharedComponentsContextProvider';

export const useUiSharedComponentsContext = () => {
	const context = React.useContext(UiSharedComponentsContextProvider);
	return context;
};
