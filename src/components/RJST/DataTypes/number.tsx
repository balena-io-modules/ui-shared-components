import { FULL_TEXT_SLUG } from '../components/Filters/SchemaSieve';
import type { CreateFilter } from './utils';
import { getDataTypeSchema } from './utils';
import type { JSONSchema7 as JSONSchema } from 'json-schema';

// This is the max safe integer supported DB: 2**31-1
const MAX_SAFE_DB_INT4 = 2147483647;

export const operators = () => ({
	is: 'is',
	is_not: 'is not',
	is_more_than: 'is more than',
	is_less_than: 'is less than',
});

export type OperatorSlug =
	| keyof ReturnType<typeof operators>
	| typeof FULL_TEXT_SLUG;

export const createFilter: CreateFilter<OperatorSlug> = (
	field,
	operator,
	value,
	propertySchema,
) => {
	const val =
		typeof value === 'number'
			? value
			: value !== '' && value != null
				? Number(value)
				: undefined;

	const fieldType = propertySchema?.type ?? 'number';

	if (
		val == null ||
		isNaN(val) ||
		(fieldType === 'integer' &&
			(!Number.isInteger(val) || val >= MAX_SAFE_DB_INT4))
	) {
		return {};
	}

	if (operator === 'is' || operator === FULL_TEXT_SLUG) {
		return {
			type: 'object',
			properties: {
				[field]: {
					type: fieldType,
					const: val,
				},
			},
			required: [field],
		};
	}

	if (operator === 'is_not') {
		return {
			type: 'object',
			properties: {
				[field]: {
					type: fieldType,
					not: {
						const: val,
					},
				},
			},
			required: [field],
		};
	}

	if (operator === 'is_more_than') {
		return {
			type: 'object',
			properties: {
				[field]: {
					type: fieldType,
					exclusiveMinimum: val,
				},
			},
			required: [field],
		};
	}

	if (operator === 'is_less_than') {
		return {
			type: 'object',
			properties: {
				[field]: {
					type: fieldType,
					exclusiveMaximum: val,
				},
			},
			required: [field],
		};
	}

	return {};
};

export const rendererSchema = (
	schemaField: JSONSchema,
	index: number,
	propertySchema: JSONSchema,
) => {
	const valueSchema: JSONSchema = {
		type: propertySchema.type ?? 'number',
		title: 'Value',
		description: '',
	};
	return getDataTypeSchema(schemaField, index, operators(), valueSchema);
};
