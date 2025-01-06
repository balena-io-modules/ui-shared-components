import * as types from './types';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import uniq from 'lodash/uniq';

export interface LensTemplate<T extends { id: number } = any> {
	slug: string;
	name: string;
	data: {
		label: string;
		format: string;
		renderer: (
			props: types.CollectionLensRendererProps<T>,
		) => React.ReactElement | null;
		icon: IconProp;
	};
	default?: boolean;
}

const lenses: LensTemplate[] = Object.values(types);

// Returns an array of lenses that can be used to render `data`.
export const getLenses = <T extends { id: number }>(
	data: T[] | undefined,
	customLenses?: Array<LensTemplate<T>>,
) => {
	if (!data) {
		return;
	}

	const concatenatedLenses: Array<LensTemplate<T>> = lenses.concat(
		customLenses ?? [],
	);

	const slugs = concatenatedLenses.map((lens) => lens.slug);
	if (slugs.length > uniq(slugs).length) {
		throw new Error('Lenses must have unique slugs');
	}

	return concatenatedLenses;
};
