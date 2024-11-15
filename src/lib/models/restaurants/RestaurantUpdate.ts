export type RestaurantUpdate = {
	id: string;
	address: string;
	city: string;
	country: string;
	name: string;
	tags: string[];
	google_maps_url: string;
	oldImages: string[];
	images: File[];
};
