import { useMemo } from 'react';
import Color from 'color';
import ColorHash from 'color-hash';
import memoize from 'lodash/memoize';
import { Typography, TypographyProps, useTheme } from '@mui/material';

const colorHash = new ColorHash();

export const generateHexColorFromString = memoize((text: string): string => {
	return colorHash.hex(text.replace(/\s/g, ''));
});

export const isLight = (color?: string) => {
	return Color(color).luminosity() > 0.65;
};

type HighlightedNameProps = Omit<TypographyProps, 'children'> & {
	children: string;
};

export const HighlightedName = ({
	children,
	className,
	color,
	...props
}: HighlightedNameProps) => {
	const theme = useTheme();
	const bgColor = useMemo(
		() => generateHexColorFromString(children),
		[children],
	);

	return (
		<Typography
			sx={{
				borderRadius: '2px',
				display: 'inline-block',
				p: 2,
				color: color || isLight(bgColor) ? theme.palette.text.primary : '#fff',
				background: bgColor,
			}}
			{...props}
		>
			{children}
		</Typography>
	);
};
