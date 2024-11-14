<script lang="ts">
	import PageTitle from '$lib/components/app/PageTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	import TagInput from './TagInput.svelte';
	import { enhance } from '$app/forms';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { Delete, Map, Save, Star, Trash, X } from 'lucide-svelte';
	import GoogleMapsEmbed from './GoogleMapsEmbed.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { page } from '$app/stores';
	import ImageInputWithGallery from './ImageInputWithGallery.svelte';

	const id = $page.params.id;
	let { data, form }: { data: PageData } & { form: ActionData } = $props();
	let restaurant = $state(data.restaurant);
	let newImages: File[] = $state([]);

	const deleteNewImage = (index: number) => {
		newImages.splice(index, 1);
	};
</script>

<PageTitle back={'/app/restaurants'}
	>{id !== 'new' ? 'Edit Restaurant' : 'New Restaurant'}</PageTitle
>
{#if data.error}
	<Alert variant="destructive">Error: {data.error}</Alert>
{:else}
	<form class="max-w-4xl" method="POST" enctype="multipart/form-data" action="?/save">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-4">
				<div>
					<Label for="name">Name</Label>
					<Input type="text" id="name" name="name" bind:value={restaurant.name} required />
				</div>

				<div>
					<Label for="address">Address</Label>
					<Input type="text" id="address" name="address" bind:value={restaurant.address} required />
				</div>

				<div class="flex gap-4">
					<div class="flex-1">
						<Label for="city">City</Label>
						<Input type="text" id="city" name="city" bind:value={restaurant.city} required />
					</div>
					<div class="flex-1">
						<Label for="country">Country</Label>
						<Input
							type="text"
							id="country"
							name="country"
							bind:value={restaurant.country}
							required
						/>
					</div>
				</div>
				<div>
					<Label for="tags">Tags</Label>
					<TagInput id="tags" name="tags" bind:tags={restaurant.tags} required />
				</div>

				<div class="flex gap-4">
					<Button type="submit" class="aspect-square p-0">
						<Save class="size-6" />
					</Button>
					{#if restaurant.id && restaurant.id !== ''}
						<Button
							type="submit"
							variant="destructive"
							class="aspect-square p-0"
							formaction="?/delete"
						>
							<Trash class="size-6" />
						</Button>
						<Button variant="outline" class="ml-auto aspect-square p-0">
							<Star class="size-6" />
						</Button>
					{/if}
				</div>
			</div>
			<div class="space-y-4">
				<ImageInputWithGallery
					id="images"
					name="images"
					deleteOldImage={async (id) => {}}
					label="Images"
					oldImages={restaurant.restaurant_images}
				/>
				<div>
					<Label for="google_maps_url">Google Maps Url</Label>
					<Input
						type="text"
						id="google_maps_url"
						name="google_maps_url"
						bind:value={restaurant.google_maps_url}
						required
					/>
				</div>
				<GoogleMapsEmbed url={restaurant.google_maps_url} />
			</div>
		</div>
	</form>
{/if}
<!-- Display newly added images -->
{#if newImages.length > 0}
	<div class="new-images-preview">
		{#each newImages as newImage, index}
			<div class="relative">
				<img
					class="size-[200px] object-cover"
					src={URL.createObjectURL(newImage)}
					alt="Restaurant"
				/>
			</div>
		{/each}
	</div>
{/if}
