import type {
	RJSTContext,
	RJSTEntityPropertyDefinition,
	RJSTModel,
} from '../../schemaOps';
import type {
	CheckedState,
	Pagination,
	TableSortOptions,
} from '../../components/Table/utils';
import type { BoxProps } from '@mui/material';
export { table } from './table';

export interface LensRendererBaseProps<T extends { id: number }>
	extends Pick<BoxProps, 'flex'> {
	properties: Array<RJSTEntityPropertyDefinition<T>>;
	rjstContext: RJSTContext<T>;
	model: RJSTModel<T>;
	hasUpdateActions: boolean;
	onEntityClick?: (
		entity: T,
		event: React.MouseEvent<HTMLAnchorElement>,
	) => void;
}

export interface CollectionLensRendererProps<T extends { id: number }>
	extends LensRendererBaseProps<T> {
	filtered: T[];
	selected?: Array<Subset<T>>;
	checkedState?: CheckedState;
	sort: TableSortOptions<T> | null;
	changeSelected: (
		selected: T[] | undefined,
		allChecked?: CheckedState,
	) => void;
	data: T[] | undefined;
	onPageChange?: (page: number, itemsPerPage: number) => void;
	onSort?: (sort: TableSortOptions<T>) => void;
	pagination: Pagination;
	rowKey?: keyof T;
}
