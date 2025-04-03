export type Order = 'asc' | 'desc';

export type CheckedState = 'none' | 'some' | 'all';

export interface TableSortOptions {
	direction: Order;
	field: string;
	key: string;
	// TODO: improve typing
	sortable: boolean | ((a: any, b: any) => number) | string;
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
