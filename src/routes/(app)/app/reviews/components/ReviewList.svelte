<script lang="ts">
	import NoDataFound from '$lib/components/app/NoDataFound.svelte';
	import { Button } from '$lib/components/ui/button';

	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { StatusResponseData } from '$lib/models/common/StatusResponse';
	import type { ReviewView } from '$lib/models/reviews/ReviewView';
	import { Plus } from 'lucide-svelte';

	let searchQuery = $state('');

	type Props = {};

	let {}: Props = $props();

	const findReviews = async () => {
		const res = await fetch('/api/reviews');
		if (res.ok) {
			const data = (await res.json()) as StatusResponseData<ReviewView[]>;
			if (data.success) {
				return data.value;
			} else {
				return [];
			}
		} else {
			return [];
		}
	};
</script>

<div class="flex gap-5">
	<Input type="text" placeholder="Search Reviews..." class="w-48" bind:value={searchQuery} />
	<Button variant="ghost" href="reviews/new">
		<Plus />
	</Button>
</div>

{#await findReviews()}
	<Skeleton class="min-h-[300px] w-full" />
{:then reviews}
	{#if reviews.length === 0}
		<NoDataFound data_title="Reviews" new_url="reviews/new" />
	{:else}
		{#each reviews as review (review.id)}
			<div class="flex gap-5">
				<p>{review.restaurant}</p>
				<p>{review.rating}</p>
				<p>{review.reviewer}</p>
				<p>{review.review_date}</p>
				<p>{review.review}</p>
			</div>
		{/each}
	{/if}
{:catch error}
	<p>Error: {error.message}</p>
{/await}
