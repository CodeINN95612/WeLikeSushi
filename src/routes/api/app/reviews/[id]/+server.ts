import { StatusResponse, StatusResponseSuccess } from '$lib/models/common/StatusResponseData';
import type { GetReviewView } from '$lib/models/reviews/GetReviewView';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { id } = params;

	const { error } = await locals.supabase.from('reviews').delete().eq('id', id);
	if (error) {
		return StatusResponse(500, {
			success: false,
			error: error.message
		});
	}

	return StatusResponse(200, {
		success: true,
		value: []
	});
};

export const GET: RequestHandler = async ({ params, locals }) => {
	const { id } = params;

	const { data: review, error: getError } = await locals.supabase
		.from('reviews')
		.select('*')
		.eq('id', id)
		.single();

	if (getError) {
		return StatusResponseSuccess({
			success: false,
			error: getError.message
		});
	}

	const { data: rubricScores, error: rubricError } = await locals.supabase
		.from('review_rubric_scores')
		.select('*')
		.eq('review_id', id);

	if (rubricError) {
		return StatusResponseSuccess({
			success: false,
			error: rubricError.message
		});
	}

	const getReview: GetReviewView = {
		id: review.id,
		restaurant_id: review.restaurant_id!,
		visit_date: new Date(review.visit_date),
		review: review.review_text!,
		reviewer: review.reviewer,
		rubric: rubricScores.map((score) => ({
			id: score.rubric_element_id!,
			score: score.score
		}))
	};

	return StatusResponseSuccess({
		success: true,
		value: getReview
	});
};
