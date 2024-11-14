import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
