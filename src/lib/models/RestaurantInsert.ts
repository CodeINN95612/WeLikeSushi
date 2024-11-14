export type RestaurantInsert = {
	address: string;
	city: string;
	country: string;
	name: string;
	tags: string[];
	google_maps_url: string;
	images: File[];
};
