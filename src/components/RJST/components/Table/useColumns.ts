import type React from 'react';
import { useState, useEffect } from 'react';
import type { TagField } from './utils';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';
import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';

export const TAG_COLUMN_PREFIX = 'tag_column_';
const EXPERIMENTAL_REDUCED_DEFAULT_COLUMNS_PREFIX =
	'experimental_reduced_default__';
// Move columns logic inside a dedicated hook to make the refactor easier and move this logic without effort.
export function useColumns<T>(
	resourceName: string,
	defaultColumns: Array<RJSTEntityPropertyDefinition<T>>,
	tagKeyRender: (
		key: string,
	) => (tags: TagField[] | undefined) => React.ReactElement | null,
	useExperimentalReducedColumnLocalStorageKeyPrefix?: boolean,
) {
	const { state: analyticsState } = useAnalyticsContext();

	const [columns, setColumns] = useState(() => {
		const storedColumns = getFromLocalStorage<
			Array<RJSTEntityPropertyDefinition<T>>
		>(
			`${useExperimentalReducedColumnLocalStorageKeyPrefix ? EXPERIMENTAL_REDUCED_DEFAULT_COLUMNS_PREFIX : ''}${resourceName}__columns`,
		);
		if (storedColumns) {
			const storedColumnsMap = new Map(storedColumns.map((s) => [s.key, s]));

			const tagColumns = storedColumns.filter((c) =>
				c.key.startsWith(TAG_COLUMN_PREFIX),
			);

			const cols = [...defaultColumns, ...tagColumns]
				.map((d) => {
					const storedColumn = storedColumnsMap.get(d.key);
					return {
						...d,
						render: d.key.startsWith(TAG_COLUMN_PREFIX)
							? tagKeyRender(d.title)
							: d.render,
						selected: storedColumn?.selected ?? d.selected,
						index: storedColumn?.index ?? d.index,
					};
				})
				.sort((a, b) => a.index - b.index);
			// Remove incorrectly saved column configurations and handle any structural changes.
			const safeFilteredCols = cols.filter(
				(c) => typeof c.render === 'function',
			);

			return safeFilteredCols;
		} else {
			return defaultColumns;
		}
	});
	useEffect(() => {
		setToLocalStorage(
			`${useExperimentalReducedColumnLocalStorageKeyPrefix ? EXPERIMENTAL_REDUCED_DEFAULT_COLUMNS_PREFIX : ''}${resourceName}__columns`,
			columns.map((c) => ({
				...c,
				label: typeof c.label === 'string' ? c.label : null,
			})),
		);
	}, [
		resourceName,
		columns,
		analyticsState.featureFlags?.reducedDefaultDeviceColumns,
	]);

	return [columns, setColumns] as const;
}
