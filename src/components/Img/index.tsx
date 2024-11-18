import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { useState, useEffect } from 'react';

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

	useEffect(() => {
		setSrc(srcProp);
	}, [srcProp]);

	return (
		<Box
			component="img"
			src={src}
			{...props}
			onError={(e: SyntheticEvent<HTMLImageElement>) => {
				if (fallback != null) {
					setSrc(fallback);
				}
				onError?.(e);
			}}
		/>
	);
};
