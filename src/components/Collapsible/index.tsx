import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Accordion,
	accordionSummaryClasses,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import type {
	AccordionDetailsProps,
	AccordionProps,
	AccordionSummaryProps,
} from '@mui/material';
import { useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../../utils/storage';

// Omit expanded from AccordionProps since we manage it internally, but we can revisit it if the use case arises where the parent component needs to control the expanded state
export interface CollapsibleProps
	extends Omit<AccordionProps, 'children' | 'expanded'> {
	initiallyCollapsed?: boolean;
	summary: AccordionSummaryProps['children'];
	details: AccordionDetailsProps['children'];
	detailsProps?: Omit<AccordionDetailsProps, 'children'>;
	summaryProps?: Omit<AccordionSummaryProps, 'children'>;
	collapsedLocalStorageKey?: string; // Optional key to persist collapsed state in local storage
	defaultIconDirection?: 'up' | 'down' | 'left' | 'right';
	iconRotationOnExpand?: 'up' | 'down' | 'left' | 'right';
	iconPlacement?: 'start' | 'end';
}

const getRotationDegrees = (direction: 'up' | 'down' | 'left' | 'right') => {
	switch (direction) {
		case 'up':
			return 0;
		case 'right':
			return 90;
		case 'down':
			return 180;
		case 'left':
			return 270;
		default:
			return 0;
	}
};

export const Collapsible = ({
	initiallyCollapsed = true,
	summary,
	details,
	detailsProps,
	summaryProps,
	defaultIconDirection = 'up',
	iconRotationOnExpand = 'down',
	collapsedLocalStorageKey,
	iconPlacement = 'start',
	...props
}: CollapsibleProps) => {
	const [isCollapsed, setIsCollapsed] = useState(
		collapsedLocalStorageKey
			? (getFromLocalStorage(collapsedLocalStorageKey) ?? initiallyCollapsed)
			: initiallyCollapsed,
	);

	return (
		<Accordion
			disableGutters
			elevation={0}
			expanded={!isCollapsed}
			{...props}
			onChange={(e, expanded) => {
				setIsCollapsed(!expanded);
				if (collapsedLocalStorageKey) {
					setToLocalStorage(collapsedLocalStorageKey, !expanded);
				}
				props.onChange?.(e, expanded);
			}}
			sx={[
				{
					border: 'none',
					'&::before': {
						display: 'none',
					},
					[`& .${accordionSummaryClasses.expandIconWrapper}`]: {
						transform: `rotate(${getRotationDegrees(defaultIconDirection)}deg)`,
					},
					[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
						{
							transform: `rotate(${getRotationDegrees(iconRotationOnExpand)}deg)`,
						},
					[`& .${accordionSummaryClasses.content}`]: {
						margin: 0,
					},
				},
				...(Array.isArray(props.sx) ? props.sx : [props.sx]),
			]}
		>
			<AccordionSummary
				expandIcon={<FontAwesomeIcon icon={faChevronUp} />}
				{...summaryProps}
				sx={[
					{
						flexDirection: iconPlacement === 'start' ? 'row-reverse' : 'row',
						...(iconPlacement === 'end'
							? { justifyContent: 'space-between' }
							: {}),
						gap: 2,
						minHeight: 0,
						marginBottom: 2,
					},
					...(Array.isArray(summaryProps?.sx)
						? summaryProps.sx
						: [summaryProps?.sx]),
				]}
			>
				{summary}
			</AccordionSummary>
			<AccordionDetails
				{...detailsProps}
				sx={[
					{ padding: 0 },
					...(Array.isArray(detailsProps?.sx)
						? detailsProps.sx
						: [detailsProps?.sx]),
				]}
			>
				{details}
			</AccordionDetails>
		</Accordion>
	);
};
