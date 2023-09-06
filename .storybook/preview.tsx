import React from 'react';
import { Preview } from '@storybook/react';
import { AnalyticsContextProvider } from '../src/contexts/AnalyticsContext';
import { ScopedCssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../src/theme';
import '@balena/design-tokens/build/css/tokens.css';
import './global.css';
import './docs.css';
import { balenaTheme } from './manager';

const preview: Preview = {
	parameters: {
		backgrounds: {
			disable: true,
		},
		actions: { argTypesRegex: '^on[A-Z].*' },
		docs: {
			theme: balenaTheme,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		options: {
			storySort: {
				order: ['Introduction', 'Foundations', 'Mui Components', 'Other'],
			},
		},
	},
	decorators: [
		(Story) => (
			<ThemeProvider theme={theme}>
				<ScopedCssBaseline>
					<Story />
				</ScopedCssBaseline>
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
