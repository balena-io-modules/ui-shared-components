import { useState } from 'react';
import { Button } from '@mui/material';
import { removeFromLocalStorage } from '../../utils/storage';
import { CookiesBanner, CookiesBannerProps } from '.';
import { Meta, StoryObj } from '@storybook/react';

const CookiesTemplateBanner: React.FC<CookiesBannerProps> = ({
	show,
	onClose,
	...props
}) => {
	const [demoShow, setDemoShow] = useState(show);
	const localStorageKey = props.productName + '-cookies-set';

	return (
		<>
			<Button
				onClick={() => {
					setDemoShow(!demoShow);
					removeFromLocalStorage(localStorageKey);
				}}
			>
				Show
			</Button>
			<CookiesBanner
				show={demoShow}
				onClose={() => {
					setDemoShow(false);
				}}
				{...props}
			/>
		</>
	);
};

const meta = {
	title: 'Other/Cookies Banner',
	component: CookiesTemplateBanner,
	tags: ['autodocs'],
} satisfies Meta<typeof CookiesTemplateBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		show: false,
		productName: 'ui-shared-components',
	},
};
