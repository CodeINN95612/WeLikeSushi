import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(
		{
			status: 404,
			message: 'API endpoint not found'
		},
		{ status: 404 }
	);
};

export const POST: RequestHandler = GET;
export const PUT: RequestHandler = GET;
export const DELETE: RequestHandler = GET;
export const PATCH: RequestHandler = GET;
