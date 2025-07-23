import { Tooltip, Typography } from '@mui/material';
import { useTranslation } from '../../../../../hooks/useTranslations';
import { JsonTypes, widgetFactory } from '../utils';
import { token } from '../../../../../utils/token';

export const DisabledTextWidget = widgetFactory('DisabledText', [
	JsonTypes.string,
	JsonTypes.number,
	JsonTypes.null,
])(({ value }) => {
	const { t } = useTranslation();
	const val =
		value != null && typeof value !== 'string' ? value.toString() : value;
	return (
		<Tooltip title={val}>
			<Typography
				display="block"
				color={token('color.text.subtle')}
				maxWidth={300}
				noWrap
			>
				{val ?? t('info.not_defined')}
			</Typography>
		</Tooltip>
	);
});
