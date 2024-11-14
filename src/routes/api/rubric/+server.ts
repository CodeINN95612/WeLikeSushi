import { supabase } from '$lib/supabase';
import type { TablesInsert } from '$lib/supabase.types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { rubric }: { rubric: TablesInsert<'rubric_elements'>[] } = await request.json();

		for (const r of rubric) {
			if (!r.name || r.name === '') {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Name is required'
					}),
					{ status: 400 }
				);
			}

			if (!r.description || r.description === '') {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Description is required'
					}),
					{ status: 400 }
				);
			}

			if (!r.weight || r.weight < 0 || r.weight > 100) {
				return new Response(
					JSON.stringify({
						success: false,
						error: 'Weight is required to be between 0 and 100'
					}),
					{ status: 400 }
				);
			}
		}

		const totalWeight = rubric.reduce((sum, r) => sum + r.weight, 0);
		if (totalWeight !== 100) {
			return new Response(
				JSON.stringify({
					success: false,
					error: 'Total weight of rubric elements must be 100'
				}),
				{ status: 400 }
			);
		}

		const { error } = await supabase.from('rubric_elements').upsert(rubric, { onConflict: 'id' });
		if (error) {
			return new Response(
				JSON.stringify({
					success: false,
					error: error.message
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				error: null
			})
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				success: false,
				error: 'Unknown error'
			}),
			{ status: 500 }
		);
	}
};
