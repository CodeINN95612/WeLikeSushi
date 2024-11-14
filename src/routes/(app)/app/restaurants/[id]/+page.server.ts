import type { RestaurantWithImages } from '$lib/models/RestaurantWithImages';
import { supabase } from '$lib/supabase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RestaurantInsert } from '$lib/models/RestaurantInsert';
import type { RestaurantUpdate } from '$lib/models/RestaurantUpdate';
import type { TablesInsert } from '$lib/supabase.types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const emptyRestaurant: RestaurantWithImages = {
		address: '',
		city: '',
		country: '',
		created_at: '',
		id: '',
		name: '',
		tags: [],
		google_maps_url: '',
		restaurant_images: []
	};

	if (id === 'new') {
		return {
			restaurant: emptyRestaurant
		};
	}

	const { data, error } = await supabase
		.from('restaurants')
		.select('*, restaurant_images(*)')
		.eq('id', id)
		.single();

	if (error) {
		return {
			error: error.message,
			restaurant: emptyRestaurant
		};
	}

	return {
		restaurant: data satisfies RestaurantWithImages
	};
};

const STORAGE_BUCKET = 'restaurant_images';

export const actions: Actions = {
	delete: async ({ params }) => {
		const { id } = params;

		//Delete images from storage
		const { data, error } = await supabase
			.from('restaurant_images')
			.select('url')
			.eq('restaurant_id', id!);

		if (error) {
			return {
				error: error.message
			};
		}

		const imagesToDelete = data ?? [];
		const paths = imagesToDelete.map((i) => i.url);

		const { error: deleteError } = await supabase.storage.from(STORAGE_BUCKET).remove(paths);
		if (deleteError) {
			return {
				error: deleteError.message
			};
		}

		//Delete images from database
		const { error: deleteImagesError } = await supabase
			.from('restaurant_images')
			.delete()
			.eq('restaurant_id', id!);

		if (deleteImagesError) {
			return {
				error: deleteImagesError.message
			};
		}

		//Delete restaurant
		const { error: deleteRestaurantError } = await supabase
			.from('restaurants')
			.delete()
			.eq('id', id!);

		if (deleteRestaurantError) {
			return {
				error: deleteRestaurantError.message
			};
		}

		redirect(302, '/app/restaurants');
	},
	save: async ({ request, params }) => {
		//temp
		const errors: string[] = [];
		const { id } = params;
		const formData = await request.formData();
		const address = formData.get('address');
		const city = formData.get('city');
		const country = formData.get('country');
		const name = formData.get('name');
		const tags = formData.get('tags');
		const google_maps_url = formData.get('google_maps_url');
		const images = formData.getAll('images');
		const oldImages = formData.getAll('oldImages');

		if (!address) errors.push('Address is required.');
		if (!city) errors.push('City is required.');
		if (!country) errors.push('Country is required.');
		if (!name) errors.push('Name is required.');
		if (!tags) errors.push('Tags are required.');
		if (!google_maps_url) errors.push('Google Maps URL is required.');
		if (!images) errors.push('Images array is required.');
		if (id !== 'new' && !oldImages) errors.push('Old Images array is required.');

		if (errors.length > 0) {
			return {
				validationErrors: errors
			};
		}

		if (id == 'new') {
			const insertError = await addNewRestaurant({
				address: address as string,
				city: city as string,
				country: country as string,
				name: name as string,
				tags: JSON.parse(tags as string),
				google_maps_url: google_maps_url as string,
				images: images as File[]
			});
			if (insertError) {
				return {
					error: insertError
				};
			}
		} else {
			const updateError = await updateRestaurant({
				id: id as string,
				address: address as string,
				city: city as string,
				country: country as string,
				name: name as string,
				tags: JSON.parse(tags as string),
				google_maps_url: google_maps_url as string,
				oldImages: oldImages as string[],
				images: images as File[]
			});

			if (updateError) {
				return {
					error: updateError
				};
			}
		}

		redirect(302, '/app/restaurants');
	}
};

async function addNewRestaurant(restaurant: RestaurantInsert): Promise<string | null> {
	if (restaurant.images.length === 0) {
		return 'At least one image is required.';
	}

	const newid = crypto.randomUUID();
	const insertedImages: { fullPath: string }[] = [];
	let storageError: string | null = null;

	// Helper function for image cleanup
	const removeInsertedImages = async () => {
		if (insertedImages.length > 0) {
			await supabase.storage.from(STORAGE_BUCKET).remove(insertedImages.map((i) => i.fullPath));
		}
	};

	try {
		// Upload images to Supabase Storage
		for (const image of restaurant.images) {
			const arrayBuffer = await image.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const filePath = `r-id-${newid}/${image.name}`;

			const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, buffer, {
				contentType: image.type,
				upsert: true
			});

			if (error) {
				storageError = error.message;
				throw new Error(`Failed to upload image: ${storageError}`);
			}

			if (data) insertedImages.push(data);
		}

		// Insert the restaurant and images within a transaction
		const { error: insertError } = await supabase.from('restaurants').insert([
			{
				id: newid,
				address: restaurant.address,
				city: restaurant.city,
				country: restaurant.country,
				name: restaurant.name,
				tags: restaurant.tags,
				google_maps_url: restaurant.google_maps_url
			}
		]);

		if (insertError) {
			throw new Error(`Failed to insert restaurant: ${insertError.message}`);
		}

		// Insert images metadata into the `restaurant_images` table
		const imagesToInsert = insertedImages.map((i) => ({
			restaurant_id: newid,
			url: i.fullPath,
			description: `${restaurant.name} image`
		}));

		const { error: imageInsertError } = await supabase
			.from('restaurant_images')
			.insert(imagesToInsert);

		if (imageInsertError) {
			throw new Error(`Failed to insert image metadata: ${imageInsertError.message}`);
		}

		redirect(302, '/app/restaurants');
	} catch (error: unknown) {
		console.error('Error adding restaurant:', typeof error, error);
		await removeInsertedImages(); // Rollback uploaded images
		return 'Error adding restaurant';
	}
}

async function updateRestaurant(restaurant: RestaurantUpdate): Promise<string | null> {
	//Insert new images
	const insertedImages: { fullPath: string; path: string }[] = [];
	let storageError: string | null = null;
	for (const image of restaurant.images) {
		// Convert file to a buffer
		const arrayBuffer = await image.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Define the file path and bucket name
		const filePath = `public/r-id-${restaurant.id}/${image.name}`;

		// Upload the file buffer to Supabase Storage
		const { error, data } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, buffer, {
			contentType: image.type, // Set the MIME type
			upsert: true // Optionally overwrite existing files with the same name
		});

		if (error) {
			storageError = error.message;
			break;
		}

		if (data) {
			insertedImages.push(data);
		}
	}

	const removeInsertedImages = async () =>
		await supabase.storage.from(STORAGE_BUCKET).remove(insertedImages.map((i) => i.path));

	//if errors, delete all inserted images
	if (storageError) {
		const { error: removeError } = await removeInsertedImages();
		console.log('storageError', storageError);
		console.log('removerError', removeError);
		return storageError;
	}

	//Update Restaurant
	const { error } = await supabase
		.from('restaurants')
		.update({
			address: restaurant.address,
			city: restaurant.city,
			country: restaurant.country,
			name: restaurant.name,
			tags: restaurant.tags,
			google_maps_url: restaurant.google_maps_url
		})
		.eq('id', restaurant.id);

	if (error) {
		const { error: removeError } = await removeInsertedImages();
		console.log('removerError', removeError);
		return error.message;
	}

	const imagesToInsert = insertedImages.map(
		(i) =>
			({
				restaurant_id: restaurant.id,
				url: i.fullPath,
				description: `${restaurant.name} image`
			}) satisfies TablesInsert<'restaurant_images'>
	);
	const { error: imageInsertError } = await supabase
		.from('restaurant_images')
		.insert(imagesToInsert);

	if (imageInsertError) {
		const { error: removeError } = await removeInsertedImages();
		console.log('removerError', imageInsertError);
		console.log('removerError', removeError);
		return imageInsertError.message;
	}

	return null;
}
