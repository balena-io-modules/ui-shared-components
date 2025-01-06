import { Typography } from '@mui/material';
import { JsonTypes, widgetFactory } from '../utils';

export const PlaceholderTextWidget = widgetFactory('PlaceholderText', {}, [
	JsonTypes.string,
	JsonTypes.number,
	JsonTypes.null,
])(({ value }) => {
	const val =
		value === null || value === ''
			? 'Empty'
			: typeof value !== 'string'
				? value.toString()
				: value;
	return (
		<Typography
			noWrap
			sx={{ maxWidth: '300px' }}
			{...(!value && { color: 'gray.main' })}
		>
			{val}
		</Typography>
	);
});
