import { Reviewers } from '$lib/data/reviewers';
import type { PageServerLoad } from './$types';

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
