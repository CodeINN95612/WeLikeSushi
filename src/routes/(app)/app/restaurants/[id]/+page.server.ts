import type { RestaurantWithImages } from '$lib/models/RestaurantWithImages';
import { supabase } from '$lib/supabase';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RestaurantInsert } from '$lib/models/RestaurantInsert';
import type { RestaurantUpdate } from '$lib/models/RestaurantUpdate';
import type { TablesInsert } from '$lib/supabase.types';
import { PRIVATE_STORAGE_URL } from '$env/static/private';
import sharp from 'sharp';

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

	data.restaurant_images.forEach((image) => {
		image.url = `${PRIVATE_STORAGE_URL}/${image.url}`;
	});

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
	const insertedImages: { path: string; fullPath: string }[] = [];
	let storageError = await uploadImages(restaurant, newid, insertedImages);

	if (storageError) {
		await cleanupImages(insertedImages);
		console.error('Storage Error:', storageError);
		return storageError;
	}

	try {
		// Upload images to Supabase Storage
		for (const image of restaurant.images) {
			const arrayBuffer = await image.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const filePath = `public/r-id-${newid}/${image.name}`;

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

		return null;
	} catch (error: unknown) {
		await cleanupImages(insertedImages);
		console.error('Error adding restaurant:', error);
		if (error instanceof Error) {
			return error.message;
		}

		return 'Unknown error adding restaurant';
	}
}

async function updateRestaurant(restaurant: RestaurantUpdate): Promise<string | null> {
	const insertedImages: { fullPath: string; path: string }[] = [];
	const storageError = await uploadImages(restaurant, restaurant.id, insertedImages);

	if (storageError) {
		await cleanupImages(insertedImages);
		console.error('Storage Error:', storageError);
		return storageError;
	}

	const updateError = await updateRestaurantDetails(restaurant);

	if (updateError) {
		await cleanupImages(insertedImages);
		console.error('Update Error:', updateError);
		return updateError;
	}

	const imageInsertError = await insertRestaurantImages(restaurant, insertedImages);

	if (imageInsertError) {
		await cleanupImages(insertedImages);
		console.error('Image Insert Error:', imageInsertError);
		return imageInsertError;
	}

	return null;
}

async function uploadImages(
	restaurant: RestaurantUpdate | RestaurantInsert,
	restaurant_id: string,
	insertedImages: { fullPath: string; path: string }[]
): Promise<string | null> {
	const MAX_IMAGE_WIDTH = 1920; // Maximum width of the image
	const MAX_IMAGE_SIZE_MB = 2; // Maximum allowed size in MB
	const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

	for (const image of restaurant.images) {
		try {
			// Convert file to a buffer
			const arrayBuffer = await image.arrayBuffer();
			let buffer = Buffer.from(arrayBuffer);

			// Optimize image using Sharp
			const metadata = await sharp(buffer).metadata();

			if (metadata.size && metadata.size > MAX_IMAGE_SIZE_BYTES) {
				console.log(`Optimizing image: ${image.name}, original size: ${metadata.size} bytes`);

				// Resize and compress image
				buffer = await sharp(buffer)
					.resize({
						width: MAX_IMAGE_WIDTH,
						withoutEnlargement: true // Avoid enlarging small images
					})
					.jpeg({ quality: 80 }) // Compress to 80% quality
					.toBuffer();
			}

			const filePath = `public/r-id-${restaurant_id}/${image.name}`;
			const { error, data } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, buffer, {
				contentType: image.type,
				upsert: true
			});

			if (error) return error.message;
			if (data) insertedImages.push(data);
		} catch (error) {
			return error instanceof Error ? error.message : 'Unknown upload error';
		}
	}
	return null;
}

async function cleanupImages(insertedImages: { fullPath: string; path: string }[]): Promise<void> {
	if (insertedImages.length === 0) return;

	const { error } = await supabase.storage
		.from(STORAGE_BUCKET)
		.remove(insertedImages.map((image) => image.path));
	if (error) console.error('Cleanup Error:', error.message);
}

async function updateRestaurantDetails(restaurant: RestaurantUpdate): Promise<string | null> {
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

	return error ? error.message : null;
}

async function insertRestaurantImages(
	restaurant: RestaurantUpdate,
	insertedImages: { fullPath: string; path: string }[]
): Promise<string | null> {
	const imagesToInsert = insertedImages.map(
		(image) =>
			({
				restaurant_id: restaurant.id,
				url: image.fullPath,
				description: `${restaurant.name} image`
			}) satisfies TablesInsert<'restaurant_images'>
	);

	const { error } = await supabase.from('restaurant_images').insert(imagesToInsert);
	return error ? error.message : null;
}
