import type {
	JSONSchema7 as JSONSchema,
	JSONSchema7Definition as JSONSchemaDefinition,
} from 'json-schema';
import get from 'lodash/get';
import pick from 'lodash/pick';
import { findInObject } from './utils';
import type { ResourceTagModelService } from '../TagManagementDialog/tag-management-service';
import type { CheckedState } from './components/Table/utils';
import type { PineFilterObject } from './oData/jsonToOData';

export interface RJSTBaseResource<T> {
	id: number;
	__permissions: Permissions<T>;
}

type XHeaderLink = {
	tooltip: string;
	href: string;
};

export interface Permissions<T> {
	read: Array<keyof T>;
	create: Array<keyof T>;
	update: Array<keyof T>;
	delete: boolean;
}

export interface Priorities<T> {
	primary: Array<keyof T>;
	secondary: Array<keyof T>;
	tertiary: Array<keyof T>;
}

// This is a raw form that would not be exposed to the UI and would live either in the SDK or backend.
export interface RJSTRawModel<T> {
	resource: string;
	schema: JSONSchema;
	permissions: Dictionary<Permissions<T>>;
	priorities?: Priorities<T>;
}

export interface RJSTModel<T> {
	resource: string;
	schema: JSONSchema;
	permissions: Permissions<T>;
	priorities?: Priorities<T>;
}

export type RJSTEntityPropertyDefinition<T> = {
	title: string;
	label: string | JSX.Element;
	field: Extract<keyof T, string>;
	key: string;
	selected: boolean;
	sortable: boolean | ((a: T, b: T) => number) | string;
	index: number;
	render: (
		value: any,
		row: T,
	) => string | number | JSX.Element | null | undefined;

	type: string;
	priority: string;
	refScheme?: string;
};

export interface CustomSchemaDescription {
	'x-ref-scheme'?: string[];
	'x-foreign-key-scheme'?: string[];
	'x-filter-only'?: boolean | string[];
	'x-no-filter'?: boolean | string[];
	'x-no-sort'?: boolean | string[];
}

export type RJSTTagsSdk<T> =
	| (ResourceTagModelService & {
			getAll: (itemsOrFilters: any) => T[] | Promise<T[]>;
			canAccess: (param: {
				checkedState?: CheckedState;
				selected?: T[];
			}) => Promise<boolean>;
	  })
	| (ResourceTagModelService & object);

export interface RJSTAction<T> {
	title: string;
	type: 'create' | 'update' | 'delete';
	section?: string;
	renderer?: (props: {
		schema: JSONSchema;
		affectedEntries: T[] | undefined;
		onDone: () => void;
		/** setSelected can be can be used for delete function on server side pagination */
		setSelected?: (
			selected: Array<Subset<T>> | undefined,
			allChecked?: CheckedState,
		) => void;
	}) => React.ReactNode;
	actionFn?: (props: {
		/** affectedEntries will be undefined if pagination is server side and checkedState is "all" */
		affectedEntries: T[] | undefined;
		/** checkState can be undefined only for entity case, since card does not have a selection event  */
		checkedState?: CheckedState;
		/** setSelected can be can be used for delete function on server side pagination */
		setSelected?: (
			selected: Array<Subset<T>> | undefined,
			allChecked?: CheckedState,
		) => void;
	}) => void;
	isDisabled?: (props: {
		/** affectedEntries will be undefined if pagination is server side and checkedState is "all" */
		affectedEntries: T[] | undefined;
		/** checkState can be undefined only for entity case, since card does not have a selection event */
		checkedState?: CheckedState;
	}) => MaybePromise<string | null>;
	isDangerous?: boolean;
}

export interface RJSTSdk<T> {
	tags?: RJSTTagsSdk<T>;
	inputSearch?: (
		filter?: PineFilterObject,
	) => Promise<Array<Subset<T>> | null | undefined>;
}

export interface RJSTContext<T> {
	resource: string;
	getBaseUrl?: (entry: T) => string;
	onEntityClick?: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement>,
	) => void;
	idField: string;
	nameField?: string;
	tagField?: Extract<keyof T, string>;
	geolocation?: {
		latitudeField?: string;
		longitudeField?: string;
	};
	actions?: Array<RJSTAction<T>>;
	customSort?: Dictionary<((a: T, b: T) => number) | string | string[]>;
	sdk?: RJSTSdk<T>;
	internalPineFilter?: PineFilterObject | null;
	checkedState: CheckedState;
}

export interface ActionData<T> {
	action: RJSTAction<T>;
	schema: JSONSchema;
	affectedEntries?: T[];
	checkedState?: CheckedState;
}

export const isJson = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch {
		return false;
	}
};

// The implementation lacks handling of nested schemas and some edge cases, but is enough for now.
export const rjstJsonSchemaPick = <T>(
	schema: JSONSchema,
	selectors: Array<keyof T>,
): JSONSchema => {
	const res: JSONSchema = {
		...schema,
		properties: pick(schema.properties ?? {}, selectors as string[]),
		required: [],
	};

	res.required = schema.required?.filter((requiredField) =>
		(selectors as string[]).includes(requiredField),
	);

	return res;
};

export const getFieldForFormat = <T extends { id: number }>(
	schema: JSONSchema,
	format: string,
): Extract<keyof T, string> | undefined => {
	let propertyKeyWithFormat: Extract<keyof T, string> | undefined;

	Object.entries(schema.properties ?? {}).forEach(([key, val]) => {
		if (typeof val === 'object' && val.format === format) {
			propertyKeyWithFormat = key as Extract<keyof T, string>;
		}
	});

	return propertyKeyWithFormat;
};

export const getRefSchemePrefix = (schema: JSONSchema) => {
	return schema.items
		? 'items.properties.'
		: schema.properties
			? 'properties.'
			: '';
};

export const getRefSchemeTitle = (
	refScheme: string | undefined,
	schema: JSONSchema,
) => {
	const key = `${getRefSchemePrefix(schema)}${refScheme}.title`;
	return refScheme ? get(schema, key) : schema.title;
};

export const isJSONSchema = (
	value:
		| JSONSchema
		| JSONSchemaDefinition
		| JSONSchemaDefinition[]
		| undefined
		| null,
): value is JSONSchema => {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof value !== 'boolean' &&
		!!Object.keys(value).length
	);
};

export const parseDescription = (
	filter: JSONSchema,
): CustomSchemaDescription | null => {
	if (!filter.description) {
		return null;
	}
	try {
		return JSON.parse(filter.description);
	} catch {
		return null;
	}
};

export const parseDescriptionProperty = (
	schemaValue: JSONSchema,
	property: string,
) => {
	const description = parseDescription(schemaValue);
	return description && property in description
		? description[property as keyof typeof description]
		: null;
};

export const rjstAddToSchema = (
	schema: JSONSchema,
	schemaProperty: string,
	property: string,
	value: unknown,
): JSONSchema => {
	return {
		...schema,
		properties: {
			...schema.properties,
			[schemaProperty]: {
				...(schema.properties?.[schemaProperty] as JSONSchema),
				[property]: value,
			},
		},
	};
};

export const getHeaderLink = (
	schemaValue: JSONSchema | JSONSchemaDefinition,
): XHeaderLink | null => {
	if (typeof schemaValue === 'boolean' || !schemaValue.description) {
		return null;
	}
	try {
		const json = JSON.parse(schemaValue.description);
		return json['x-header-link'];
	} catch {
		return null;
	}
};

// TODO: This atm doesn't support ['my property']
export const convertRefSchemeToSchemaPath = (refScheme: string | undefined) => {
	return refScheme
		?.split('.')
		.join('.properties.')
		.replace(/\[\d+\]/g, '.items');
};

export const getRefSchemaPrefix = (propertySchema: JSONSchema) => {
	return propertySchema.type === 'array' ? `items.properties.` : `properties.`;
};

export const generateSchemaFromRefScheme = (
	schema: JSONSchema,
	parentProperty: string,
	refScheme: string | undefined,
): JSONSchema => {
	const propertySchema =
		(schema.properties?.[parentProperty] as JSONSchema) ?? schema;
	if (!refScheme) {
		return propertySchema;
	}
	const convertedRefScheme = `${getRefSchemaPrefix(
		propertySchema,
	)}${convertRefSchemeToSchemaPath(refScheme)}`;
	const typePaths: string[][] = [];
	const ongoingIncrementalPath: string[] = [];
	convertedRefScheme.split('.').forEach((key) => {
		if (['properties', 'items'].includes(key)) {
			typePaths.push([...ongoingIncrementalPath, 'type']);
		}
		ongoingIncrementalPath.push(key);
	});
	if (ongoingIncrementalPath.length) {
		typePaths.push(ongoingIncrementalPath);
	}
	return {
		...propertySchema,
		description: JSON.stringify({ 'x-ref-scheme': [refScheme] }),
		title:
			(get(propertySchema, convertedRefScheme) as JSONSchema)?.title ??
			propertySchema.title,
		...pick(propertySchema, typePaths),
	};
};

export const getRefSchema = (
	schema: JSONSchema,
	refSchemePrefix: string,
): JSONSchema => {
	const refScheme = parseDescriptionProperty(schema, 'x-ref-scheme');
	return refScheme
		? ((get(schema, `${refSchemePrefix}${refScheme}`) as JSONSchema) ?? schema)
		: schema;
};

export const getPropertyScheme = (
	schemaValue: JSONSchema | JSONSchemaDefinition | null,
): string[] | null => {
	const json = isJSONSchema(schemaValue) ? parseDescription(schemaValue) : null;
	return json?.['x-foreign-key-scheme'] ?? json?.['x-ref-scheme'] ?? null;
};

export const getSubSchemaFromRefScheme = (
	schema: JSONSchema | JSONSchemaDefinition,
	refScheme?: string,
): JSONSchema => {
	const referenceScheme = refScheme ?? getPropertyScheme(schema)?.[0];
	const convertedRefScheme = convertRefSchemeToSchemaPath(referenceScheme);
	if (!convertedRefScheme || !isJSONSchema(schema)) {
		return schema as JSONSchema;
	}
	const properties = findInObject(schema, 'properties');
	return get(properties, convertedRefScheme) as JSONSchema;
};

export const getSchemaFormat = (schema: JSONSchema) => {
	const property = getSubSchemaFromRefScheme(schema);
	return property.format ?? schema.format;
};

export const getSchemaTitle = (
	jsonSchema: JSONSchema,
	propertyKey: string,
	refScheme?: string,
) => {
	return (
		(refScheme
			? getSubSchemaFromRefScheme(jsonSchema, refScheme).title
			: jsonSchema?.title) ?? propertyKey
	);
};

export const rjstAdaptRefScheme = (
	value: unknown,
	property: JSONSchemaDefinition,
) => {
	if (!property || value == null) {
		return null;
	}
	if (typeof property === 'boolean') {
		return value;
	}
	if (
		!property.description?.includes('x-ref-scheme') ||
		!isJson(property.description)
	) {
		return value;
	}
	const refScheme = getPropertyScheme(property);
	const transformed =
		(Array.isArray(value) && value.length <= 1 ? value[0] : value) ?? null;
	return refScheme ? (get(transformed, refScheme[0]) ?? null) : transformed;
};
