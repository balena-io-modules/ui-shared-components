import React from 'react';
import { UiSharedComponentsContextProvider } from '../contexts/UiSharedComponentsContextProvider';

export const useNavigate = () => {
	const { navigate } = React.useContext(UiSharedComponentsContextProvider);
	return navigate;
};
