import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MUILinkWithTracking } from '.';
import { BrowserRouter, Route, Routes } from 'react-router';

const meta = {
	title: 'Other/MUILinkWithTracking',
	component: MUILinkWithTracking,
	tags: ['autodocs'],
} satisfies Meta<typeof MUILinkWithTracking>;

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
							<MUILinkWithTracking {...args} />
						</React.Fragment>
					}
				/>
			</Routes>
		</BrowserRouter>
	),
	args: {
		href: '#',
		children: 'Material Link with analytics',
		onClick: (e) => {
			e.preventDefault();
		},
	},
};
