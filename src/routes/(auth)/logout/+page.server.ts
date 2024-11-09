import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete('auth_token', { path: '/' });
		redirect(303, '/login');
	}
};
