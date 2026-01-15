import type { StrictRJSFSchema as JSONSchema } from '@rjsf/utils';

export type JSONSchemaDefinition = NonNullable<
	JSONSchema['properties']
>[string];

export type PartialJSONSchemaTypeName = Exclude<
	JSONSchema['type'],
	Array<JSONSchema['type']> | 'null' | undefined
>;
