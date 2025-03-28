import { Typography } from '@mui/material';
import { JsonTypes, widgetFactory } from '../utils';
import { token } from '../../../../../utils/token';

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
			{...(!value && { color: token('color.text.subtle') })}
		>
			{val}
		</Typography>
	);
});
