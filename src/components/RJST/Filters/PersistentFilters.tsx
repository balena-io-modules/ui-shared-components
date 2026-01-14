import * as React from 'react';
import qs from 'qs';
import type { StrictRJSFSchema as JSONSchema } from '@rjsf/utils';
import type { FiltersProps } from '../components/Filters';
import { Filters } from '../components/Filters';
import type { FilterDescription } from '../components/Filters/SchemaSieve';
import {
	FULL_TEXT_SLUG,
	createFilter,
	createFullTextSearchFilter,
	parseFilterDescription,
} from '../components/Filters/SchemaSieve';
import { isJSONSchema } from '../schemaOps';
import { useAnalyticsContext } from '../../../contexts/AnalyticsContext';
import type { NavigateFunction } from 'react-router-dom';

export interface ListQueryStringFilterObject {
	n: string;
	o: string;
	v: string;
}

const isListQueryStringFilterRule = (
	rule: any,
): rule is ListQueryStringFilterObject =>
	rule != null &&
	typeof rule === 'object' &&
	// it has to have an associated field
	!!rule.n &&
	typeof rule.n === 'string' &&
	// it should at least have an operator
	((!!rule.o && typeof rule.o === 'string') ||
		// or a value
		(rule.v != null && rule.v !== ''));

const isQueryStringFilterRuleset = (
	rule: any,
): rule is ListQueryStringFilterObject[] =>
	Array.isArray(rule) &&
	!!rule?.length &&
	rule?.every(isListQueryStringFilterRule);

export function listFilterQuery(filters: JSONSchema[], stringify: true): string;
export function listFilterQuery(
	filters: JSONSchema[],
	stringify?: false,
): Array<ListQueryStringFilterObject[] | undefined>;
export function listFilterQuery(filters: JSONSchema[], stringify = true) {
	const queryStringFilters = filters.map((filter) => {
		const signatures =
			filter.title === FULL_TEXT_SLUG
				? [parseFilterDescription(filter)].filter(
						(f): f is FilterDescription => !!f,
					)
				: filter.anyOf
						?.filter((f): f is JSONSchema => isJSONSchema(f))
						.map(
							(f) =>
								({
									...parseFilterDescription(f),
									operatorSlug: f.title,
								}) as FilterDescription & { operatorSlug?: string },
						)
						.filter((f) => !!f);

		return signatures?.map<ListQueryStringFilterObject>(
			({
				field,
				operator,
				operatorSlug,
				value,
			}: FilterDescription & { operatorSlug?: string }) => ({
				n: field,
				o: operatorSlug ?? operator,
				v: value,
			}),
		);
	});
	return stringify
		? qs.stringify(queryStringFilters, {
				strictNullHandling: true,
			})
		: queryStringFilters;
}

export const loadRulesFromUrl = (
	searchLocation: string,
	schema: JSONSchema,
	navigate?: NavigateFunction,
): JSONSchema[] => {
	const { properties } = schema;
	if (!searchLocation || !properties) {
		return [];
	}
	const parsed =
		qs.parse(searchLocation, {
			ignoreQueryPrefix: true,
			strictNullHandling: true,
		}) || {};

	let hasInvalidSignatures = false;

	const rules = (Array.isArray(parsed) ? parsed : Object.values(parsed))
		.filter(isQueryStringFilterRuleset)
		.map(
			(r: ListQueryStringFilterObject[]) => {
				if (hasInvalidSignatures) {
					// When we have already found an invalid signature,
					// there is no point to continue parsing the rest
					// so we return early.
					return;
				}
				if (!Array.isArray(r)) {
					r = [r];
				}
				const signatures = r.map(({ n, o, v }: ListQueryStringFilterObject) => {
					// The 'qs' library doesn't automatically parse values into their respective types (e.g., numbers, booleans).
					// It treats everything as a string by default, as explained in the documentation:
					// https://github.com/ljharb/qs#parsing-primitivescalar-values-numbers-booleans-null-etc
					// To handle this, we use a transformer to avoid scattering parsing logic across multiple filters.
					let value: any = v;
					const num = Number(v);
					// Only try to transform the value from a string if the operator is not full text search and the field cannot be a string
					if (
						o !== FULL_TEXT_SLUG &&
						typeof properties[n] === 'object' &&
						'type' in properties[n] &&
						(Array.isArray(properties[n].type)
							? !properties[n].type.includes('string')
							: properties[n].type !== 'string')
					) {
						if (!isNaN(num)) {
							value = num;
						} else {
							switch (v) {
								case 'true':
									value = true;
									break;
								case 'false':
									value = false;
									break;
								case 'null':
									value = null;
									break;
								case 'undefined':
									value = undefined;
							}
						}
					}
					return {
						field: n,
						operator: o,
						value,
					};
				});

				const isSignaturesInvalid = signatures.some((s) => {
					const fieldExist =
						Object.keys(properties).includes(s.field) ||
						s.operator === FULL_TEXT_SLUG;
					const operatorIsValid =
						s.operator != null &&
						typeof s.operator === 'string' &&
						s.operator?.split(' ').length === 1;
					return !fieldExist || !operatorIsValid;
				});

				// In case of invalid signatures, remove search params to avoid Errors.
				if (isSignaturesInvalid) {
					navigate?.({ search: '' }, { replace: true });
					hasInvalidSignatures = true;
					return;
				}

				if (signatures[0].operator === FULL_TEXT_SLUG) {
					// TODO: listFilterQuery serializes the already escaped value and this
					// then re-escapes while de-serializing. Fix that loop, which can keep
					// escaping regex characters (eg \) indefinitely on each call/reload from the url.
					return createFullTextSearchFilter(
						schema,
						String(signatures[0].value),
					);
				}
				return createFilter(schema, signatures);
			},
			// TODO: createFilter should handle this case as well.
		)
		.filter((f): f is JSONSchema => !!f);

	if (hasInvalidSignatures) {
		// When we have found an invalid signature, we clear the url search params
		// and return no filters, even if some of them were successfully parsed.
		return [];
	}
	return rules;
};

interface PersistentFiltersProps extends FiltersProps {
	navigate?: NavigateFunction;
}

export const PersistentFilters = ({
	schema,
	views,
	filters,
	onViewsChange,
	onFiltersChange,
	navigate,
	onSearch,
	...otherProps
}: PersistentFiltersProps &
	Required<Pick<PersistentFiltersProps, 'renderMode'>>) => {
	const { state: analytics } = useAnalyticsContext();
	const { pathname, search } = document.location;
	const storedFilters = React.useMemo(() => {
		return loadRulesFromUrl(search, schema, navigate);
	}, [search, schema, navigate]);

	const onFiltersUpdate = React.useCallback(
		(updatedFilters: JSONSchema[]) => {
			// Get filter query in two steps: first parse the filters, then stringify outside the function for performance
			const parsedFilters = listFilterQuery(updatedFilters, false);
			const filterQuery = qs.stringify(parsedFilters, {
				strictNullHandling: true,
			});

			navigate?.(
				{
					pathname,
					search: filterQuery,
				},
				{ replace: true },
			);

			onFiltersChange?.(updatedFilters);

			if (filterQuery !== search.substring(1)) {
				analytics.webTracker?.track('Update table filters', {
					current_url: location.origin + location.pathname,
					// Need to reduce to a nested object instead of nested array for Amplitude to pick up on the property
					filters: Object.assign({}, parsedFilters),
				});
			}
		},
		[onFiltersChange, analytics.webTracker, navigate, pathname, search],
	);

	// When the component mounts, filters from the page URL,
	// then communicate them back to the parent component.
	React.useEffect(() => {
		// Make sure we only call onFiltersUpdate on mount once, even if
		// we are rendering each part of the Filter component separately.
		const normalizedRenderMode = new Set(
			Array.isArray(otherProps.renderMode)
				? otherProps.renderMode
				: [otherProps.renderMode],
		);

		if (normalizedRenderMode.has('all') || normalizedRenderMode.has('add')) {
			onFiltersUpdate?.(storedFilters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Filters
			schema={schema}
			filters={filters ?? storedFilters}
			views={views}
			onFiltersChange={onFiltersUpdate}
			onViewsChange={onViewsChange}
			{...otherProps}
			onSearch={onSearch}
		/>
	);
};
