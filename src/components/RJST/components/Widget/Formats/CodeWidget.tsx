import { Tooltip } from '@mui/material';
import { Copy } from '../../../../Copy';
import { JsonTypes, widgetFactory } from '../utils';
import { Code } from '../../../../Code';

export const CodeWidget = widgetFactory('Code', [JsonTypes.string])(({
	value,
}) => {
	return (
		<Copy copy={value}>
			<Tooltip title={value}>
				<Code noWrap>{value}</Code>
			</Tooltip>
		</Copy>
	);
});
