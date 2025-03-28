import * as arrayType from './array';
import * as stringType from './string';
import * as objectType from './object';
import * as booleanType from './boolean';
import * as numberType from './number';
import * as enumType from './enum';
import * as oneOfType from './oneOf';
import * as dateTimeType from './date-time';

import {
	type JSONSchema7 as JSONSchema,
	type JSONSchema7Definition as JSONSchemaDefinition,
	type JSONSchema7TypeName as JSONSchemaTypeName,
} from 'json-schema';
import { getPropertySchema } from '../components/Filters/SchemaSieve';
import { getRefSchema } from '../schemaOps';

type ExcludeLiteral<T, U> = T extends U ? never : T;

type PartialJSONSchemaTypeName = ExcludeLiteral<JSONSchemaTypeName, 'null'>;

type DataTypeModule =
	| typeof arrayType
	| typeof objectType
	| typeof stringType
	| typeof booleanType
	| typeof numberType
	| typeof enumType
	| typeof oneOfType
	| typeof dateTimeType;

export type TransformedDataTypeModule = Omit<DataTypeModule, 'operators'> & {
	operators: Record<string, string>;
	operatorsOneOf: JSONSchema[];
};

/* eslint-disable id-denylist	*/
const dataTypeMap: Record<PartialJSONSchemaTypeName, DataTypeModule> = {
	array: arrayType,
	string: stringType,
	object: objectType,
	boolean: booleanType,
	number: numberType,
	integer: numberType,
};

export const isDateTimeFormat = (format: string | undefined) =>
	format?.endsWith('date-time');

const transformModule = (
	module: DataTypeModule | undefined,
	property: JSONSchema,
): TransformedDataTypeModule | null => {
	if (!module) {
		return null;
	}
	const operators = module.operators(property);
	const operatorsOneOf = Object.entries(operators).map(([key, value]) => ({
		title: value,
		const: key,
	}));
	return {
		...module,
		operators,
		operatorsOneOf,
	};
};

// This function will retrieve the data type model based on the property type.
// if the JSONSchema property is a number, it will get DataTypes/number.tsx.
export const getDataModel = (
	property: JSONSchemaDefinition | undefined,
): TransformedDataTypeModule | null => {
	if (!property || typeof property === 'boolean') {
		return null;
	}
	try {
		let module: DataTypeModule;
		const { format, type, enum: propertyEnum, oneOf } = property;
		if (propertyEnum) {
			module = enumType;
		} else if (oneOf) {
			module = oneOfType;
		} else if (format?.endsWith('date-time')) {
			module = dateTimeType;
		} else {
			if (!type) {
				return null;
			}
			const typeSet = Array.isArray(type) ? type : [type];
			const dataTypeKey = Object.keys(dataTypeMap).find((t) =>
				typeSet.includes(t as JSONSchemaTypeName),
			);
			if (!dataTypeKey) {
				return null;
			}
			module = dataTypeMap[dataTypeKey as keyof typeof dataTypeMap];
		}
		return transformModule(module, property);
	} catch (error) {
		console.error('Error loading component', error);
		throw error;
	}
};

export const getPropertySchemaAndModel = (
	field: string,
	schema: JSONSchema,
) => {
	const propertySchema = getPropertySchema(field, schema);
	// this does not work with array of arrays yet, it should be implemented as soon as we need it
	const prefix =
		propertySchema?.type === 'array' ? 'items.properties.' : 'properties.';
	const refSchema = propertySchema
		? getRefSchema(propertySchema, prefix)
		: propertySchema;

	return { model: getDataModel(refSchema), propertySchema: refSchema };
};

export const getAllOperators = (schema: JSONSchema) => {
	return {
		...arrayType.operators(),
		...stringType.operators(),
		...objectType.operators(schema),
		...booleanType.operators(),
		...numberType.operators(),
		...enumType.operators(),
		...oneOfType.operators(),
		...dateTimeType.operators(),
	};
};
