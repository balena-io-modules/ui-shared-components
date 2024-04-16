import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgressWithLabel } from '.';
import { useEffect, useState } from 'react';

const meta = {
	title: 'Other/CircularProgressWithLabel',
	component: CircularProgressWithLabel,
	tags: ['autodocs'],
} satisfies Meta<typeof CircularProgressWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { value: 40 },
	render: (args) => {
		const [progress, setProgress] = useState(args.value);

		useEffect(() => {
			const timer = setInterval(() => {
				setProgress((prevProgress) =>
					prevProgress >= 100 ? 0 : prevProgress + 10,
				);
			}, 800);
			return () => {
				clearInterval(timer);
			};
		}, []);

		return <CircularProgressWithLabel value={progress} />;
	},
};
