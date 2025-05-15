import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JsonTypes, widgetFactory } from '../utils';
import { Box, Typography } from '@mui/material';

export const BooleanAsIconWidget = widgetFactory('BooleanAsIcon', [
	JsonTypes.boolean,
	JsonTypes.number,
	JsonTypes.null,
])(({ value }) => {
	const text = value ? 'true' : 'false';
	return (
		<Box alignItems="center" gap={2}>
			<FontAwesomeIcon icon={value ? faCheckCircle : faTimesCircle} />{' '}
			<Typography>{text}</Typography>
		</Box>
	);
});
