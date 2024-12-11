import type { WeLikeSushiDatabase } from '$lib/data/types';
import { StatusResponse } from '$lib/models/common/StatusResponseData';
import type { CreateReviewView } from '$lib/models/reviews/CreateReviewView';
import type { ReviewView } from '$lib/models/reviews/ReviewView';
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

	const reviews = data.map((review) => {
		return {
			id: review.id,
			restaurant: review.restaurant!.name,
			rating: review.rating!,
			reviewer: review.reviewer,
			review_date: review.visit_date!,
			review: review.review_text!
		} as ReviewView;
	});

	return StatusResponse(200, {
		success: true,
		value: reviews
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const review = (await request.json()) as CreateReviewView;

	if (!review) {
		return StatusResponse(400, {
			success: false,
			error: 'Invalid request body'
		});
	}

	if (!review.id) {
		return StatusResponse(400, {
			success: false,
			error: 'Review ID is required'
		});
	}

	if (!review.restaurant_id) {
		return StatusResponse(400, {
			success: false,
			error: 'Restaurant ID is required'
		});
	}

	if (!review.review) {
		return StatusResponse(400, {
			success: false,
			error: 'Details are required'
		});
	}

	for (const rating of review.rubric) {
		if (!rating) {
			return StatusResponse(400, {
				success: false,
				error: 'Rubric ratings are required'
			});
		}
		if (!rating.id) {
			return StatusResponse(400, {
				success: false,
				error: 'Score ID is required'
			});
		}
		if (!rating.score) {
			return StatusResponse(400, {
				success: false,
				error: 'Score is required'
			});
		}
	}

	try {
		const { id, error } =
			review.id === 'new'
				? await createReview(locals.supabase, review)
				: await updateReview(locals.supabase, review);

		if (error) {
			return StatusResponse(500, {
				success: false,
				error: error
			});
		}

		return StatusResponse(200, {
			success: true,
			value: {
				id
			}
		});
	} catch (e) {
		if (e instanceof Error) {
			return StatusResponse(500, {
				success: false,
				error: e.message
			});
		}

		return StatusResponse(500, {
			success: false,
			error: 'An error occurred'
		});
	}
};
async function createReview(supabase: WeLikeSushiDatabase, review: CreateReviewView) {
	const id = crypto.randomUUID();

	const { rating, error: ratingError } = await calculateRating(supabase, review.rubric);
	if (ratingError) {
		return { id: null, error: ratingError };
	}

	const visit_date = review.visit_date as unknown as string;

	const { error } = await supabase.from('reviews').insert({
		id,
		restaurant_id: review.restaurant_id,
		reviewer: review.reviewer,
		visit_date,
		created_at: new Date().toISOString(),
		rating: rating!,
		review_text: review.review
	});

	if (error) {
		return { id: null, error: error.message };
	}

	const { error: insertScoreError } = await supabase.from('review_rubric_scores').insert(
		review.rubric.map((rubric) => ({
			review_id: id,
			rubric_element_id: rubric.id,
			score: rubric.score
		}))
	);

	if (insertScoreError) {
		return { id: null, error: insertScoreError.message };
	}

	return { id, error: null };
}

async function updateReview(supabase: WeLikeSushiDatabase, review: CreateReviewView) {
	const { rating, error: ratingError } = await calculateRating(supabase, review.rubric);
	if (ratingError) {
		return { id: null, error: ratingError };
	}

	const visit_date = review.visit_date as unknown as string;

	const { error } = await supabase
		.from('reviews')
		.update({
			restaurant_id: review.restaurant_id,
			reviewer: review.reviewer,
			visit_date,
			rating: rating!,
			review_text: review.review
		})
		.eq('id', review.id);

	if (error) {
		return { id: null, error: error.message };
	}

	//delete old scores
	const { error: deleteScoreError } = await supabase
		.from('review_rubric_scores')
		.delete()
		.eq('review_id', review.id);

	if (deleteScoreError) {
		return { id: null, error: deleteScoreError.message };
	}

	const { error: insertScoreError } = await supabase.from('review_rubric_scores').insert(
		review.rubric.map((rubric) => ({
			review_id: review.id,
			rubric_element_id: rubric.id,
			score: rubric.score
		}))
	);

	if (insertScoreError) {
		return { id: null, error: insertScoreError.message };
	}

	return { id: review.id, error: null };
}

async function calculateRating(
	supabase: WeLikeSushiDatabase,
	scores: { id: string; score: number }[]
) {
	let rating = 0;
	for (const rubric of scores) {
		const { data, error: weightError } = await supabase
			.from('rubric_elements')
			.select('weight')
			.eq('id', rubric.id)
			.single();
		if (weightError) {
			return { rating: null, error: weightError.message };
		}

		rating += ((data?.weight ?? 0) * rubric.score) / 100;
	}

	return { rating, error: null };
}
