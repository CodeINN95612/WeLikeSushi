import { Reviewers } from '$lib/data/reviewers';
import { StatusResponse } from '$lib/models/common/StatusResponseData';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: restaurants, error: restaurantError } = await supabase
		.from('restaurants')
		.select('*');

	if (restaurantError) {
		return {
			error: restaurantError.message
		};
	}

	const { data: rubric, error: rubricError } = await supabase.from('rubric_elements').select('*');

	if (rubricError) {
		return {
			error: rubricError.message
		};
	}

	return {
		restaurants: restaurants.map((r) => ({
			value: r.id,
			label: r.name
		})),
		rubric: rubric,
		reviewers: Reviewers
	};
};

export const actions: Actions = {
	save: async () => {
		return StatusResponse(201, {
			success: true,
			value: []
		});
	},
	delete: async ({ params, locals: { supabase } }) => {
		const { id } = params;

		const { error } = await supabase.from('reviews').delete().eq('id', id);
		if (error) {
			return StatusResponse(500, {
				success: false,
				error: error.message
			});
		}

		redirect(302, '/app/reviews');
	}
};
