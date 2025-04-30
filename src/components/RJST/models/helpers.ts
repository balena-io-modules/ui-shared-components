import isEmpty from 'lodash/isEmpty';
import type { RJSTModel, RJSTRawModel } from '../schemaOps';
import { rjstJsonSchemaPick } from '../schemaOps';

type Transformers<
	T extends Dictionary<any>,
	TTransformer extends Dictionary<any>,
	TContext,
> = {
	[field in keyof TTransformer]: (
		entry: T,
		context?: TContext,
	) => TTransformer[field];
};

export const rjstDefaultPermissions = {
	read: [],
	create: [],
	update: [],
	delete: false,
};

export const rjstRunTransformers = <
	T extends Dictionary<any>,
	TResult extends T,
	TContext = null,
>(
	data: T | undefined,
	transformers: Transformers<T, Omit<TResult, keyof T>, TContext>,
	context?: TContext,
): TResult | undefined => {
	if (!data) {
		return data;
	}

	if (!transformers || isEmpty(transformers)) {
		return data as TResult;
	}

	const transformEntry = (entry: TResult) => {
		Object.entries(transformers).forEach(
			([fieldName, transformer]: [keyof TResult, any]) => {
				entry[fieldName] = transformer(entry, context);
			},
		);
	};

	// We mutate the data for performance reasons, it shouldn't matter as it is just a middleware.
	const mutatedData = data as TResult;
	if (Array.isArray(mutatedData)) {
		mutatedData.forEach(transformEntry);
	} else {
		transformEntry(mutatedData);
	}
	return mutatedData;
};

// This transformation would happen elsewhere, and it wouldn't be part of RJST
export const rjstGetModelForCollection = <T>(
	model: RJSTRawModel<T>,
	context?: { accessRole?: string[] | null },
): RJSTModel<T> => {
	const accessRole = context?.accessRole;
	const schema = model.priorities
		? rjstJsonSchemaPick(model.schema, [
				...model.priorities.primary,
				...model.priorities.secondary,
				...model.priorities.tertiary,
			])
		: model.schema;
	return {
		...model,
		permissions: (!!accessRole?.length &&
			accessRole.map(
				(a) => model.permissions[a] ?? model.permissions['default'],
			)) || [model.permissions['default']],
		schema,
	};
};
