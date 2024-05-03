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
			| 'onDelete'
			| 'clickable'
			| 'onClick'
			| 'avatar'
			| 'icon'
			| 'deleteIcon'
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
export const Chip: OverridableComponent<ChipTypeMap> = function (
	props: ChipProps,
) {
	return <MuiChip {...props} />;
};
