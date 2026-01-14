import type { StrictRJSFSchema as JSONSchema } from '@rjsf/utils';
import * as React from 'react';
import {
	FULL_TEXT_SLUG,
	parseFilterDescription,
	type FilterDescription as SieveFilterDescription,
} from './SchemaSieve';
import { isDateTimeFormat } from '../../DataTypes';
import { isEqual } from 'es-toolkit';
import { findInObject } from '../../utils';
import { isJSONSchema } from '../../schemaOps';
import type { TagItem, TagProps } from '../../../Tag';
import { Tag } from '../../../Tag';
import { format as dateFormat } from 'date-fns';

const transformToReadableValue = (
	parsedFilterDescription: SieveFilterDescription,
): string => {
	const { schema, value } = parsedFilterDescription;
	if (schema && isDateTimeFormat(schema.format)) {
		return dateFormat(value, 'PPPppp');
	}
	const schemaEnum: JSONSchema['enum'] = findInObject(schema, 'enum');
	const schemaEnumNames: string[] | undefined = findInObject(
		schema,
		'enumNames',
	);
	if (schemaEnum && schemaEnumNames) {
		const index = schemaEnum.findIndex((a) => isEqual(a, value));
		return schemaEnumNames[index];
	}

	const oneOf: JSONSchema['oneOf'] = findInObject(schema, 'oneOf');
	if (oneOf) {
		const selected = oneOf.find(
			(o) => isJSONSchema(o) && isEqual(o.const, value),
		);

		return isJSONSchema(selected) && selected.title ? selected.title : value;
	}

	if (typeof value === 'object') {
		if (Object.keys(value).length > 1) {
			return Object.entries(value)
				.map(([key, v]) => {
					const property = schema.properties?.[key];
					return isJSONSchema(property)
						? `${property.title ?? key}: ${v}`
						: `${key}: ${v}`;
				})
				.join(', ');
		}
		return Object.values(value)[0] as string;
	}

	return String(value);
};

export interface FilterDescriptionProps extends Omit<TagProps, 'value'> {
	filter: JSONSchema;
}

export const FilterDescription = ({
	filter,
	...props
}: FilterDescriptionProps) => {
	const tagProps = React.useMemo(() => {
		if (filter.title === FULL_TEXT_SLUG) {
			const parsedFilterDescription = parseFilterDescription(filter);
			if (!parsedFilterDescription) {
				return;
			}
			return parsedFilterDescription
				? [
						{
							name: parsedFilterDescription.field,
							operator: 'contains',
							value: transformToReadableValue(parsedFilterDescription),
						},
					]
				: undefined;
		}

		return filter.anyOf
			?.map((f, index) => {
				if (!isJSONSchema(f)) {
					return;
				}
				const parsedFilterDescription = parseFilterDescription(f);
				if (!parsedFilterDescription) {
					return;
				}
				const value = transformToReadableValue(parsedFilterDescription);
				return {
					name:
						parsedFilterDescription?.schema?.title ??
						parsedFilterDescription.field,
					operator: parsedFilterDescription.operator,
					value,
					prefix: index > 0 ? 'or' : undefined,
				};
			})
			.filter((f) => Boolean(f));
	}, [filter]) as TagItem[];

	return tagProps ? <Tag mt={2} multiple={tagProps} {...props} /> : null;
};
