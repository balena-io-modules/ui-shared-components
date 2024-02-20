import type { Meta, StoryObj } from '@storybook/react';
import { SurroundingOverlay, type SurroundingOverlayProps } from '.';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

const Template = (props: Omit<SurroundingOverlayProps, 'targetElement'>) => {
	const [element, setElement] = useState<any | null>(null);
	useEffect(() => {
		document.addEventListener('click', () => {
			setElement(null);
		});
		return () =>
			document.removeEventListener('click', () => {
				setElement(null);
			});
	}, []);
	return (
		<SurroundingOverlay targetElement={element} {...props}>
			<Box sx={{ height: '100vh', position: 'relative' }}>
				<Box
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setElement(e.target);
						}}
					>
						Show overlay
					</Button>
				</Box>
			</Box>
		</SurroundingOverlay>
	);
};

const meta = {
	title: 'Other/SurroundingOverlay',
	component: Template,
	tags: ['autodocs'],
} satisfies Meta<typeof SurroundingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		layerColor: 'black',
		opacity: 0.6,
		padding: 30,
	},
};
