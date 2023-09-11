import React from 'react';
import { Preview } from '@storybook/react';
import { AnalyticsContextProvider } from '../src/contexts/AnalyticsContext';
import { CookiesContextProvider } from '../src/contexts/CookiesContext';
import { ThemeProvider } from '@mui/material';
import { theme } from '../src/theme';

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
		(Story) => (
			<CookiesContextProvider
				cookies={{
					marketing: {
						title: 'Marketing',
						description:
							'We use cookies to get marketing info from the traffic in our platform',
						value: false,
						required: true,
					},
					analytics: {
						title: 'Analytics',
						description:
							'We use cookies to get analytics from the traffic in our platform',
						value: false,
					},
				}}
			>
				<Story />
			</CookiesContextProvider>
		),
	],
};

export default preview;
