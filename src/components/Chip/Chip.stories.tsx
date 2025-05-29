import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Chip } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const meta = {
	title: 'Mui Components/Data Display/Chip',
	component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Chip',
	},
};

export const WithIcon: Story = {
	args: {
		...Default.args,
		icon: <FontAwesomeIcon icon={faWarning} />,
	},
};
