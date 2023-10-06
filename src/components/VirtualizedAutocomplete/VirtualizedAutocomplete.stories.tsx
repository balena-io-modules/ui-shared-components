import type { Meta, StoryObj } from '@storybook/react';
import {
	VirtualizedAutocomplete,
	VirtualizedAutocompleteWithPaginationProps,
} from '.';
import { Box, ChipTypeMap, TextField } from '@mui/material';
import { ElementType, useState } from 'react';

const virtualizedMeta = {
	title: 'Other/VirtualizedAutocomplete',
	component: VirtualizedAutocomplete,
	tags: ['autodocs'],
} satisfies Meta<typeof VirtualizedAutocomplete>;

export default virtualizedMeta;
type VirtualizedStory = StoryObj<typeof virtualizedMeta>;

export const Default: VirtualizedStory = {
	args: {
		options: Array.from({ length: 1000 }, () => Math.random().toString()),
		renderOption: (props, option) => (
			<Box component="li" {...props}>
				{option as string}
			</Box>
		),
		renderInput: (params) => <TextField {...params} />,
		disableClearable: true,
		fullWidth: true,
	},
};

// TODO: FIGURE OUT WHY THIS IS NOT WORKING
const VirtualizedPaginatedTemplate = <
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends ElementType = ChipTypeMap['defaultComponent'],
>(
	args: Omit<
		VirtualizedAutocompleteWithPaginationProps<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>,
		'loadNext'
	>,
) => {
	const [prevQuery, setPrevQuery] = useState('');
	const [paginatedArray, setPaginatedArray] = useState<Value[]>([]);
	const [page, setPage] = useState(-1);

	return (
		<VirtualizedAutocomplete<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>
			{...args}
			loadNext={async (pageToLoad, query) => {
				if (pageToLoad > page) {
					setPage(pageToLoad);
					setPaginatedArray(
						paginatedArray.concat(
							Array.from({ length: 50 }, () =>
								Math.random().toString(),
							) as Value[],
						),
					);
				}
				if (query !== prevQuery) {
					setPrevQuery(query ?? '');
					const filteredArray = paginatedArray.filter((option) =>
						JSON.stringify(option).includes(query ?? ''),
					);
					return { data: filteredArray, totalItems: filteredArray.length + 1 };
				}
				return { data: paginatedArray, totalItems: paginatedArray.length + 1 };
			}}
		/>
	);
};

const virtualizedPaginatedMeta = {
	title: 'Other/VirtualizedPaginatedAutocomplete',
	component: VirtualizedPaginatedTemplate,
	tags: ['autodocs'],
} satisfies Meta<typeof VirtualizedPaginatedTemplate>;

type VirtualizedPaginatedStory = StoryObj<typeof virtualizedPaginatedMeta>;

export const WithPagination: VirtualizedPaginatedStory = {
	args: {
		renderOption: (props, option) => (
			<Box component="li" {...props}>
				{option as string}
			</Box>
		),
		renderInput: (params) => <TextField {...params} />,
		disableClearable: true,
		fullWidth: true,
	},
};
