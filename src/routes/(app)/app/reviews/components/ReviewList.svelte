<script lang="ts">
	import NoDataFound from '$lib/components/app/NoDataFound.svelte';
	import { Button } from '$lib/components/ui/button';

	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { StatusResponseData } from '$lib/models/common/StatusResponseData';
	import { filterReviewView, type ReviewView } from '$lib/models/reviews/ReviewView';
	import { Plus } from 'lucide-svelte';
	import ReviewItem from './ReviewItem.svelte';
	import { page } from '$app/stores';

	const initialRestaurant = $page.url.searchParams.get('restaurant_name') ?? '';

	let searchQuery = $state(initialRestaurant);
	let reviews = $state<ReviewView[]>([]);
	let filteredReviews = $derived(reviews.filter((r) => filterReviewView(r, searchQuery)));

	const findReviews = async () => {
		const res = await fetch('/api/app/reviews');
		if (res.ok) {
			const data = (await res.json()) as StatusResponseData<ReviewView[]>;
			if (data.success) {
				reviews = data.value;
			}
		}
	};
</script>

<div class="flex gap-5">
	<Input type="text" placeholder="Search Reviews..." class="w-48" bind:value={searchQuery} />
	<Button variant="ghost" href="reviews/new">
		<Plus />
	</Button>
</div>

<div class="flex flex-wrap gap-4 py-4">
	{#await findReviews()}
		<Skeleton class="min-h-[300px] w-full" />
	{:then _}
		{#if reviews.length === 0}
			<NoDataFound data_title="Reviews" new_url="reviews/new" />
		{:else}
			{#each filteredReviews as review (review.id)}
				<ReviewItem {review} />
			{/each}
		{/if}
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
