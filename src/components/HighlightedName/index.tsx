import { useMemo } from 'react';
import Color from 'color';
import ColorHash from 'color-hash';
import memoize from 'lodash/memoize';
import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import { token } from '../../utils/token';

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
	const bgColor = useMemo(
		() => generateHexColorFromString(children),
		[children],
	);

	return (
		<Typography
			sx={{
				borderRadius: token('shape.borderRadius.xs'),
				display: 'inline-block',
				p: 2,
				color:
					token(color || isLight(bgColor)
						? 'color.text'
						: 'color.text.inverse'),
				background: bgColor,
			}}
			{...props}
		>
			{children}
		</Typography>
	);
};
