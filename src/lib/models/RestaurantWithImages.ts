import type { RestaurantImage } from './RestaurantImage';

export type RestaurantWithImages = {
	address: string;
	city: string;
	country: string;
	created_at: string | null;
	id: string;
	name: string;
	tags: string[];
	google_maps_url: string | null;
	restaurant_images: RestaurantImage[];
};
