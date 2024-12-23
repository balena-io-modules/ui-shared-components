import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, type BoxProps, Button, Tooltip, Typography } from '@mui/material';

// Prevent the tags taking up too much horizontal space
const MAX_ITEMS_TO_DISPLAY = 3;

const tagItemsToString = (items: TagItem[]) => {
	return items
		.map((item, index) => {
			const prefix = index > 0 ? `${item.prefix ?? ','} ` : '';
			const separator = item.operator ? ` ${item.operator} ` : ': ';
			return (
				prefix +
				(item.value ? `${item.name}${separator}${item.value}` : item.name)
			);
		})
		.join('\n');
};

export interface TagProps extends Omit<BoxProps, 'onClick'> {
	/** The value part of the tag */
	value?: string;
	/** The name part of the tag, if not provided, only the value will be shown */
	name?: string;
	/** The operator that goes between the name and value of the tag */
	operator?: string;
	/** An array of name-value pairs, with an optional delimiter to be used between the previous and current tag entry */
	multiple?: TagItem[];
	/** Callback method, that if passed, a "close" button will be added to the right-hand side of the tag */
	onClose?: (event: React.MouseEvent<HTMLElement>) => void;
	/** Callback method, that if passed, the tag will become clickable */
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Tag = ({
	name,
	operator,
	value,
	multiple,
	onClose,
	onClick,
	...props
}: TagProps) => {
	let tagArray = multiple ?? [{ name, operator, value }];

	if (!tagArray.length) {
		return null;
	}
	const overflow = tagArray.length > MAX_ITEMS_TO_DISPLAY;

	if (overflow) {
		tagArray = [tagArray[0], { name: `... and ${tagArray.length - 1} more` }];
	}

	const tagContent = (
		<Tooltip title={overflow ? tagItemsToString(multiple ?? []) : undefined}>
			<Box
				sx={(theme) => ({
					backgroundColor: theme.palette.blue.light,
					border: `1px solid ${theme.palette.info.main}`,
					borderRadius: '2px',
					lineHeight: 1.5,
					width: 'fit-content',
					py: 1,
					px: 2,
				})}
			>
				{tagArray.map((tagEntry, index) => {
					const nameValueSeparator = tagEntry.operator
						? ` ${tagEntry.operator} `
						: ': ';

					return (
						<React.Fragment key={index}>
							{index > 0 && !overflow && (
								<Typography
									sx={{
										whitespace: 'pre',
										fontStyle: 'italic',
										color: 'palette.primary',
									}}
								>{`  ${tagEntry.prefix ?? ','}  `}</Typography>
							)}

							{!tagEntry.value && !tagEntry.name && (
								<Typography
									sx={{
										fontStyle: 'italic',
										color: 'palette.primary',
									}}
								>
									no value
								</Typography>
							)}

							{tagEntry.name && (
								<Typography
									sx={{
										whitespace: 'pre',
										color: 'palette.primary',
									}}
								>
									{`${tagEntry.name}${tagEntry.value ? nameValueSeparator : ''}`}
								</Typography>
							)}

							{tagEntry.value && (
								<Typography
									sx={{
										fontWeight: 'bold',
										color: 'palette.primary',
									}}
								>
									{tagEntry.value}
								</Typography>
							)}
						</React.Fragment>
					);
				})}
			</Box>
		</Tooltip>
	);

	return (
		<Box {...props}>
			{onClick ? <Button onClick={onClick}>{tagContent}</Button> : tagContent}
			{onClose && (
				<Button
					sx={(theme) => ({
						py: 1,
						pl: 2,
						pr: 3,
						fontSize: 1,
						color: theme.palette.customGrey.main,
					})}
					onClick={onClose}
				>
					<FontAwesomeIcon icon={faTimes} />
				</Button>
			)}
		</Box>
	);
};

export interface TagItem {
	value?: string;
	name?: string;
	operator?: string;
	prefix?: string;
}
