import React from 'react';
import { UiSharedComponentsContextProvider } from '../contexts/UiSharedComponentsContextProvider';

export const useHistory = () => {
	const { history } = React.useContext(UiSharedComponentsContextProvider);
	return history;
};
