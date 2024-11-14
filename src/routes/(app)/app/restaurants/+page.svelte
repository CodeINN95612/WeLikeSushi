<script lang="ts">
	import OrderBadge from '$lib/components/app/OrderBadge.svelte';
	import PageTitle from '$lib/components/app/PageTitle.svelte';
	import RestaurantCard from '$lib/components/app/RestaurantCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let orderedRestaurants = $state(data.restaurants.sort((a, b) => a.name.localeCompare(b.name)));

	let searchQuery = $state('');

	type Orderable = {
		name: string;
		selected: boolean;
		property: keyof (typeof data.restaurants)[0];
	};
	const orderables = $state([
		{ name: 'Name', selected: true, property: 'name' },
		{ name: 'Country', selected: false, property: 'country' },
		{ name: 'City', selected: false, property: 'city' }
	] satisfies Orderable[]);

	function orderBy(order: Orderable) {
		orderables.forEach((o) => {
			if (o.name === order.name) {
				o.selected = true;
			} else {
				o.selected = false;
			}
		});

		orderedRestaurants = data.restaurants.sort((a, b) => {
			const property = order.property as keyof (typeof data.restaurants)[0];
			if (typeof a[property] === 'string' && typeof b[property] === 'string') {
				return a[property].localeCompare(b[property]);
			} else if (typeof a[property] === 'number' && typeof b[property] === 'number') {
				return b[property] - a[property];
			}

			return 0;
		});
	}
</script>

<PageTitle>Restaurants</PageTitle>

{#if data.restaurants.length === 0}
	<p class="text-xl font-semibold">No restaurants found.</p>
	<Button variant="default" href="restaurants/new" class="mt-2 w-48">Add New</Button>
{:else}
	<div class="flex gap-5">
		<Input type="text" placeholder="Search Restaurants..." class="w-48" bind:value={searchQuery} />
		<Button variant="ghost" href="restaurants/new">
			<Plus />
		</Button>
	</div>

	<div class="my-5 flex gap-2">
		{#each orderables as o}
			<OrderBadge bind:selected={o.selected} onclick={() => orderBy(o)}>{o.name}</OrderBadge>
		{/each}
	</div>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each orderedRestaurants as restaurant}
			<RestaurantCard {restaurant} />
		{/each}
	</div>
{/if}
