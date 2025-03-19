import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Box,
	type BoxProps,
	Button,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';
import { token } from '../../utils/token';

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
				sx={{
					backgroundColor: token('color.bg.accent'),
					border: `1px solid ${token('color.border.accent')}`,
					borderRadius: token('shape.borderRadius.xs'),
					lineHeight: 1.5,
					width: 'fit-content',
					py: 1,
					px: 2,
				}}
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
									}}
								>
									{`  ${tagEntry.prefix ?? ','}  `}
								</Typography>
							)}

							{!tagEntry.value && !tagEntry.name && (
								<Typography
									sx={{
										fontStyle: 'italic',
									}}
								>
									no value
								</Typography>
							)}

							{tagEntry.name && (
								<Typography
									sx={{
										whitespace: 'pre',
									}}
								>
									{`${tagEntry.name}${tagEntry.value ? nameValueSeparator : ''}`}
								</Typography>
							)}

							{tagEntry.value && (
								<Typography
									sx={{
										fontWeight: 'bold',
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
			{onClick ? (
				<Button variant="text" onClick={onClick}>
					{tagContent}
				</Button>
			) : (
				tagContent
			)}
			{onClose && (
				<IconButton
					size="small"
					disableFocusRipple
					disableRipple
					color="secondary"
					sx={{
						py: 1,
						pl: 1,
						pr: 2,
					}}
					onClick={onClose}
				>
					<FontAwesomeIcon icon={faTimes} />
				</IconButton>
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
