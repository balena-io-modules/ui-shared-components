import { Typography } from '@mui/material';
import { JsonTypes, widgetFactory } from '../utils';

export const WrapWidget = widgetFactory('Wrap', [JsonTypes.string])(({
	value,
}) => {
	return (
		<Typography sx={{ maxWidth: '475px', whitespace: 'normal' }}>
			{value}
		</Typography>
	);
});
