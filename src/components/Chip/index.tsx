import { Chip as MuiChip, ChipTypeMap as MuiChipTypeMap } from '@mui/material';
import React from 'react';
import {
	OverridableComponent,
	OverrideProps,
} from '@mui/material/OverridableComponent';

type ChipTypeMap<
	P = {},
	D extends React.ElementType = MuiChipTypeMap['defaultComponent'],
> = {
	props: P &
		Omit<
			MuiChipTypeMap['props'],
			| 'size'
			| 'clickable'
			| 'onClick'
			| 'avatar'
			| 'disabled'
			| 'skipFocusWhenDisabled'
		>;
	defaultComponent: D;
};

export type ChipProps<
	D extends React.ElementType = MuiChipTypeMap['defaultComponent'],
	P = {},
> = OverrideProps<MuiChipTypeMap<P, D>, D>;

/**
 * Based on https://mui.com/material-ui/react-chip/ but with fewer props (see the table below).
 *
 * @param props
 * @constructor
 */
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(
	props: ChipProps,
	ref,
) {
	return <MuiChip {...props} ref={ref} />;
});
