import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async () => {
		redirect(303, '/app'); // Redirect to home on success
	}
};
