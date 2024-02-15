import { Box, BoxProps } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

export interface ImgProps extends BoxProps<'img'> {
	fallback?: BoxProps<'img'>['src'];
}

/**
 * This component will display an image given an src.
 * The `fallback` prop has been added to make it easier to update the image in case the primary src fails.
 */
export const Img = ({
	src: srcProp,
	onError,
	fallback,
	...props
}: ImgProps) => {
	const [src, setSrc] = useState(srcProp);

	return (
		<Box
			component="img"
			src={src}
			{...props}
			onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
				if (fallback != null) {
					setSrc(fallback);
				}
				onError?.(e);
			}}
		/>
	);
};
