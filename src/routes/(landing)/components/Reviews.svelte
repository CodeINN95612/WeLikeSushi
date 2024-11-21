<script lang="ts">
	import type { PaginationResult } from '$lib/models/common/PaginationResult';
	import type { StatusResponseData } from '$lib/models/common/StatusResponseData';
	import type { ReviewView } from '$lib/models/reviews/ReviewView';
	import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import ReviewSkelleton from './ReviewSkelleton.svelte';
	import { queryParameters, ssp } from 'sveltekit-search-params';

	let params = queryParameters({
		page: ssp.number(1),
		size: ssp.number(10)
	});

	let reviews: PaginationResult<ReviewView[]> = $state({
		data: [],
		currentPage: 1,
		totalPages: 1,
		nextPage: null,
		previousPage: null,
		pageSize: 10,
		totalItems: 0
	});

	let loading = $state(false);
	let error = $state('');

	async function getReviews() {
		const response = await fetch(`/api/reviews?page=${params.page}&size=${params.size}`);

		if (!response.ok) {
			error = 'Error fetching reviews';
			return;
		}

		const data = (await response.json()) as StatusResponseData<PaginationResult<ReviewView[]>>;
		if (data.success) {
			reviews = data.value;
		} else {
			error = data.error;
		}
	}

	async function loadReviews(page: number) {
		params.page = page || 1;
		try {
			loading = true;
			await getReviews();
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		loadReviews(params.page);
	});
</script>

<section id="reviews" class="space-y-8 py-10">
	<h3 class="text-2xl font-semibold">Restaurantes</h3>
	<div class="flex">
		<input
			type="text"
			placeholder="Filter by restaurant..."
			class="bg-wls-background ring-offset-wls-background placeholder:text-wls-muted-foreground border-wls-input focus-visible:ring-wls-ring flex h-10 rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		/>
		<select
			class="bg-wls-card text-wls-foreground border-wls-border focus:border-wls-primary ml-2 rounded border p-2 focus:outline-none"
		>
			<option value="latest">Latest</option>
			<option value="oldest">Oldest</option>
			<option value="highest">Highest Rated</option>
			<option value="lowest">Lowest Rated</option>
		</select>
	</div>
	<div class="flex flex-col gap-4">
		{#if loading}
			{#each Array.from({ length: 3 }) as _, i}
				<div class="border-wls-muted relative flex items-center rounded-lg border-2 p-4">
					<ReviewSkelleton class="mr-4 size-[200px] rounded-lg" />
					<div class="flex-1 space-y-4">
						<ReviewSkelleton class="h-6 w-1/3 rounded-md" />
						<ReviewSkelleton class="h-4 w-1/4 rounded-md" />
						<ReviewSkelleton class="h-20 w-full rounded-md" />
						<ReviewSkelleton class="h-4 w-1/6 rounded-md" />
					</div>
					<ReviewSkelleton class="absolute right-1 top-1 h-8 w-24 rounded-md" />
				</div>
			{/each}
		{:else if error}
			<div class="bg-wls-destructive text-wls-destructive-foreground rounded-md p-4">
				{error}
			</div>
		{:else if reviews.data.length === 0}
			<div class="text-wls-foreground">No reviews found</div>
		{:else}
			{#each reviews.data as review}
				<div
					class="border-wls-border bg-wls-card text-wls-foreground relative flex items-center rounded-lg border-2 p-4"
				>
					<img
						src="https://via.placeholder.com/200"
						alt="Restaurant"
						class="mr-4 size-[200px] rounded-lg object-cover"
					/>
					<div class="flex flex-col">
						<h4 class="text-xl font-semibold">{review.restaurant}</h4>
						<p class="text-wls-muted-foreground text-sm">
							Reviewed by {review.reviewer} on {review.review_date}
						</p>
						<p class="mt-2">{review.review}</p>
						<div class="text-wls-secondary mt-2">Rating: {review.rating} / 5</div>
					</div>

					<a
						href={`/reviews/${review.id}`}
						class="text-wls-primary hover:text-wls-secondary absolute right-1 top-1 flex rounded-md p-2 underline underline-offset-2"
					>
						Read More
						<ExternalLink class="ml-1 size-4" />
					</a>
				</div>
			{/each}
		{/if}
	</div>
	<div class="text-wls-primary-foreground flex items-center justify-center gap-4">
		<button
			class="bg-wls-primary hover:bg-wls-secondary disabled:bg-wls-muted flex items-center rounded p-2"
			disabled={!reviews.previousPage}
			onclick={() => loadReviews(params.page - 1)}
		>
			<ArrowLeft class="size-6" />
		</button>
		<span class="text-wls-foreground">
			Page {params.page} of {reviews.totalPages}
		</span>
		<button
			class="bg-wls-primary hover:bg-wls-secondary disabled:bg-wls-muted flex items-center rounded p-2"
			disabled={!reviews.nextPage}
			onclick={() => loadReviews(params.page + 1)}
		>
			<ArrowRight class="size-6" />
		</button>
	</div>
</section>
