import React from 'react';
import { Preview } from '@storybook/react';
import { AnalyticsContextProvider } from '../src/contexts/AnalyticsContext';
import { ThemeProvider } from '@mui/material';
import { theme } from '../src/theme';
import '@balena/design-tokens/build/css/tokens.css';
import './global.css';
import './docs.css';

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<Story />
			</ThemeProvider>
		),
		(Story) => (
			<AnalyticsContextProvider>
				<Story />
			</AnalyticsContextProvider>
		),
	],
};

export default preview;
