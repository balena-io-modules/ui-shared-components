import type { RJSTEntityPropertyDefinition } from '../../schemaOps';

export type Order = 'asc' | 'desc';

export type CheckedState = 'none' | 'some' | 'all';

export interface TableSortOptions<T> {
	direction: Order;
	field: string;
	key: string;
	sortable: RJSTEntityPropertyDefinition<T>['sortable'];
	refScheme?: string;
}

export type Pagination = {
	itemsPerPage: number;
	serverSide: boolean;
	currentPage: number;
	totalItems: number;
};

export type TagField = {
	tag_key: string;
	value: string;
};
