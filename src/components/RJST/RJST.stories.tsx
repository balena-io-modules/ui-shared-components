import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { RJSTRawModel } from '.';
import {
	RJST,
	rjstGetModelForCollection,
	rjstRunTransformers,
	type RJSTProps,
} from '.';
import { QueryClient, QueryClientProvider } from 'react-query';

const demoModel = {
	resource: 'demo_resource_membership',
	schema: {
		type: 'object',
		required: [],
		properties: {
			group: {
				title: 'Group',
				type: 'string',
			},
			assigned_roles: {
				title: 'Assigned Roles',
				type: 'array',
				description: '{"x-ref-scheme": ["role_name"]}',
				items: {
					properties: {
						role_name: {
							type: ['string', 'null'],
						},
					},
				},
			},
			action_settings: {
				title: 'Action Settings',
				format: 'demo-actions',
				description: '{"x-no-filter": true, "x-no-sort": true}',
			},
		},
	},
	permissions: {
		default: {
			read: ['group', 'assigned_roles', 'action_settings'],
			create: ['group'],
			update: ['group'],
			delete: true,
		},
	},
	priorities: {
		primary: ['group'],
		secondary: ['assigned_roles', 'action_settings'],
		tertiary: [],
	},
} as RJSTRawModel<(typeof demoData)[number]>;

const demoData = [
	{
		group: 'Backend',
		assigned_roles: [
			{
				role_name: 'viewer',
			},
		],
		action_settings: 'Action Setting 1',
	},
	{
		group: 'UI',
		assigned_roles: [
			{
				role_name: 'contributor',
			},
		],
		action_settings: 'Action Setting 2',
	},
];

const transformers = {
	__permissions: () => {
		return demoModel.permissions['default'];
	},
};

const SimpleRjstTemplate = ({
	actions,
	data,
	...props
}: Omit<RJSTProps<any>, 'model'>) => {
	const queryClient = new QueryClient();
	const memoizedModel = React.useMemo(() => {
		return rjstGetModelForCollection(demoModel);
	}, []);

	const memoizedData = React.useMemo(() => {
		return rjstRunTransformers(data, transformers, {});
	}, [data]);
	return (
		<QueryClientProvider client={queryClient}>
			<RJST data={memoizedData ?? []} model={memoizedModel} {...props} />
		</QueryClientProvider>
	);
};

const meta = {
	title: 'Other/RJS Table',
	component: SimpleRjstTemplate,
	tags: ['autodocs'],
} satisfies Meta<typeof SimpleRjstTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		data: demoData,
	},
};
