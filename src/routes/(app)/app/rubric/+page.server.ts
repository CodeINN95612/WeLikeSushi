import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: rubric, error } = await supabase.from('rubric_elements').select('*');

	if (error) {
		return {
			rubric: null,
			error
		};
	}

	return {
		rubric,
		error: null
	};
};
