import { Copy } from '../../../../Copy';
import { JsonTypes, truncateHash, widgetFactory } from '../utils';

export const HashWidget = widgetFactory('Hash', [JsonTypes.string])(({
	value,
}) => {
	return <Copy copy={value}>{truncateHash(value)}</Copy>;
});
