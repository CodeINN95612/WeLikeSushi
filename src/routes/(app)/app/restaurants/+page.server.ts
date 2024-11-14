import type { RestaurantWithImages } from '$lib/models/RestaurantWithImages';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
					image.url = `${supabase.storage.from('restaurant_images').getPublicUrl(image.url)}`;
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
