import type { PaginationResult } from '$lib/models/common/PaginationResult';
import { StatusResponse } from '$lib/models/common/StatusResponseData';
import type { ReviewView } from '$lib/models/reviews/ReviewView';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const pageStr = url.searchParams.get('page') || '1';
	const pageSizeStr = url.searchParams.get('pageSize') || '10';

	const page = Number(pageStr);
	const pageSize = Number(pageSizeStr);

	//count total items from supabase
	const { count: initialCount, error: countError } = await supabase
		.from('reviews') // Replace with your table name
		.select('*', { count: 'exact' });
	const count = initialCount ?? 0;

	if (countError) {
		return StatusResponse<PaginationResult<ReviewView[]>>(200, {
			success: false,
			error: countError.message
		});
	}

	const totalPages = Math.ceil(count / pageSize);
	if (page < 1 || page > totalPages) {
		return StatusResponse<PaginationResult<ReviewView[]>>(404, {
			success: false,
			error: `Page ${page} not found.`
		});
	}

	const { error, data } = await supabase
		.from('reviews')
		.select('*, restaurant:restaurants(name)')
		.range((page - 1) * pageSize, pageSize);

	if (error) {
		return StatusResponse<PaginationResult<ReviewView[]>>(200, {
			success: false,
			error: error.message
		});
	}

	const mappedReviews = data.map(
		(review) =>
			({
				id: review.id,
				rating: review.rating ?? 0,
				restaurant: review.restaurant?.name ?? 'Unknown',
				reviewer: 'Damian',
				review: review.review_text ?? '',
				review_date: review.visit_date ?? new Date()
			}) satisfies ReviewView
	);

	return StatusResponse<PaginationResult<ReviewView[]>>(200, {
		success: true,
		value: {
			data: mappedReviews,
			totalItems: count,
			totalPages: Math.ceil(count / pageSize),
			currentPage: page,
			pageSize,
			nextPage: page === count / pageSize ? null : page + 1,
			previousPage: page === 1 ? null : page - 1
		}
	});
};
