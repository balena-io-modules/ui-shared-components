import {
	UiOption,
	JsonTypes,
	widgetFactory,
	formatTimestamp,
	timeSince,
} from '../utils';
import { Material, Tooltip } from '../../../../..';
const { Typography } = Material;

export const ElapsedTimeWidget = widgetFactory(
	'ElapsedTime',
	[JsonTypes.string, JsonTypes.number],
	{
		dtFormat: UiOption.string,
	},
)(({ value }) => {
	if (!value) {
		return null;
	}

	return (
		<Tooltip title={formatTimestamp(value)}>
			<Typography>{timeSince(value)}</Typography>
		</Tooltip>
	);
});
