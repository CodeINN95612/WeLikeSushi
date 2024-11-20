import type { RestaurantWithImages } from '$lib/models/restaurants/RestaurantWithImages';
import type { PageServerLoad } from './$types';

import { PRIVATE_STORAGE_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		const { data, error } = await supabase.from('restaurants').select('*, restaurant_images(*)');

		if (error) {
			return {
				restaurants: [] satisfies RestaurantWithImages[],
				error: error.message
			};
		}

		data.forEach((restaurant) => {
			if (restaurant.restaurant_images) {
				restaurant.restaurant_images.forEach((image) => {
					image.url = `${PRIVATE_STORAGE_URL}/${image.url}`;
				});
			}
		});

		return {
			restaurants: data satisfies RestaurantWithImages[],
			error: null
		};
	} catch (error) {
		return {
			restaurants: [] satisfies RestaurantWithImages[],
			error: error
		};
	}
};
