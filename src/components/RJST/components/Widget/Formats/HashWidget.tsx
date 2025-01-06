import { Code } from '@mui/icons-material';
import { Copy } from '../../../../Copy';
import { JsonTypes, truncateHash, widgetFactory } from '../utils';

export const HashWidget = widgetFactory('Hash', {}, [JsonTypes.string])(({
	value,
}) => {
	return (
		<Copy copy={value}>
			<Code>{truncateHash(value)}</Code>
		</Copy>
	);
});
