<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import type { RestaurantWithImages } from '$lib/models/RestaurantWithImages';
	import { Badge } from '../ui/badge';
	import CardImageCarrousel from './CardImageCarrousel.svelte';

	let { restaurant }: { restaurant: RestaurantWithImages } = $props();

	async function navigateToRestaurant() {
		await goto(`restaurants/${restaurant.id}`);
	}
</script>

<Card.Root class="cursor-pointer" onclick={() => navigateToRestaurant()}>
	<Card.Header>
		<Card.Title>{restaurant.name}</Card.Title>
		<Card.Description>
			{restaurant.address} <br />
			{restaurant.city}, {restaurant.country}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<CardImageCarrousel images={restaurant.restaurant_images} />
	</Card.Content>
	<Card.Footer>
		<div class="flex flex-wrap gap-2">
			{#each restaurant.tags as tag}
				<Badge variant="secondary">{tag}</Badge>
			{/each}
		</div>
	</Card.Footer>
</Card.Root>
