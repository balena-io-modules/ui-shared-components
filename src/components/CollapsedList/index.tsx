import { Avatar, Box, Button, Collapse, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';

export interface CollapsedListProps {
	list:
		| Array<{
				name: string;
				logo: string | null;
		  }>
		| undefined;
	collapseItems?: number;
}

/**
 * This will collapse a long list and allow to expand it by clicking the "expand" button.
 */
export const CollapsedList = ({
	list,
	collapseItems = 3,
}: CollapsedListProps) => {
	const [showMore, setShowMore] = useState(false);
	const listItems = useMemo(
		() => (
			<Box display="flex" flexDirection="column">
				{list?.map((item, index) => (
					<Typography
						variant="body2"
						display="flex"
						alignItems="center"
						key={index}
						my={1}
					>
						{item.logo && (
							<Avatar
								variant="square"
								component="span"
								alt={item.name}
								src={item.logo ?? ''}
								sx={{
									width: '24px',
									height: '24px',
									marginRight: 2,
								}}
							/>
						)}
						{item.name}
					</Typography>
				))}
			</Box>
		),
		[list],
	);
	if (!list) {
		return null;
	}
	return (
		<Box display="flex" flexDirection="column" justifyContent="center">
			<Collapse in={showMore} collapsedSize={collapseItems * 33}>
				{listItems}
			</Collapse>
			{list.length > collapseItems && (
				<Button
					onClick={() => {
						setShowMore(!showMore);
					}}
				>
					{showMore ? 'Less' : 'More'}
					{showMore ? (
						<FontAwesomeIcon icon={faCaretUp} />
					) : (
						<FontAwesomeIcon icon={faCaretDown} />
					)}
				</Button>
			)}
		</Box>
	);
};
