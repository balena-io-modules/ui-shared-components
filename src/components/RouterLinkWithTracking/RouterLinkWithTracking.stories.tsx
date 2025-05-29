import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RouterLinkWithTracking } from '.';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const meta = {
	title: 'Other/RouterLinkWithTracking',
	component: RouterLinkWithTracking,
	tags: ['autodocs'],
} satisfies Meta<typeof RouterLinkWithTracking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<BrowserRouter>
			<Routes>
				<Route
					path="*"
					element={
						<React.Fragment>
							<RouterLinkWithTracking {...args} />
						</React.Fragment>
					}
				/>
			</Routes>
		</BrowserRouter>
	),
	args: {
		to: '/',
		children: 'Router Link with analytics',
	},
};
