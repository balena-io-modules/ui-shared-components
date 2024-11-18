import { useState } from 'react';
import { Button } from '@mui/material';
import { removeFromLocalStorage } from '../../utils/storage';
import type { CookiesBannerProps } from '.';
import { CookiesBanner } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const CookiesTemplateBanner = ({
	show,
	onClose,
	...props
}: CookiesBannerProps) => {
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
		cookies: {
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
		},
	},
};
