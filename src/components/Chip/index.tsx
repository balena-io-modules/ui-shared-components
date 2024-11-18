import type { ChipTypeMap as MuiChipTypeMap } from '@mui/material';
import { Chip as MuiChip } from '@mui/material';
import React from 'react';
import type { OverrideProps } from '@mui/material/OverridableComponent';

export type ChipProps<
	D extends React.ElementType = MuiChipTypeMap['defaultComponent'],
	P = object,
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
