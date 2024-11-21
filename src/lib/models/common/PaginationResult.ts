export type PaginationResult<T> = {
	data: T;
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
	nextPage: number | null;
	previousPage: number | null;
};
