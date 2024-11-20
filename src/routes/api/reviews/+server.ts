import { invalidateAll } from '$app/navigation';
import { StatusResponse } from '$lib/models/common/StatusResponse';
import type { ReviewView } from '$lib/models/reviews/ReviewView';
import { supabase_admin } from '$lib/server/supabase_admin';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { data, error } = await locals.supabase
		.from('reviews')
		.select('*, restaurant:restaurants(name)')
		.order('visit_date', { ascending: false });

	if (error) {
		return StatusResponse(500, {
			success: false,
			error: error.message
		});
	}

	const reviews = await Promise.all(
		data.map(async (review) => {
			const {
				data: { user },
				error
			} = await supabase_admin.auth.admin.getUserById(review.user_id!);
			if (error) {
				console.log('Error getting user', error.message);
				await invalidateAll();
			}
			return {
				id: review.id,
				restaurant: review.restaurant!.name,
				rating: review.rating!,
				reviewer: user?.email ?? 'Unknown',
				review_date: review.visit_date!,
				review: review.review_text!
			} as ReviewView;
		})
	);

	return StatusResponse(200, {
		success: true,
		value: reviews
	});
};
