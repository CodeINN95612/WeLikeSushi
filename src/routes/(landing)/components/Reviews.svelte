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
			class="flex h-10 rounded-md border border-wls-input bg-wls-background px-3 py-2 text-sm ring-offset-wls-background placeholder:text-wls-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wls-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		/>
		<select
			class="ml-2 rounded border border-wls-border bg-wls-card p-2 text-wls-foreground focus:border-wls-primary focus:outline-none"
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
				<div class="relative flex items-center rounded-lg border-2 border-wls-muted p-4">
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
			<div class="rounded-md bg-wls-destructive p-4 text-wls-destructive-foreground">
				{error}
			</div>
		{:else if reviews.data.length === 0}
			<div class="text-wls-foreground">No reviews found</div>
		{:else}
			{#each reviews.data as review}
				<div
					class="relative flex items-center rounded-lg border-2 border-wls-border bg-wls-card p-4 text-wls-foreground"
				>
					<img
						src="https://via.placeholder.com/200"
						alt="Restaurant"
						class="mr-4 size-[200px] rounded-lg object-cover"
					/>
					<div class="flex flex-col">
						<h4 class="text-xl font-semibold">{review.restaurant}</h4>
						<p class="text-sm text-wls-muted-foreground">
							Reviewed by {review.reviewer} on {review.review_date}
						</p>
						<p class="mt-2">{review.review}</p>
						<div class="mt-2 text-wls-secondary">Rating: {review.rating} / 5</div>
					</div>

					<a
						href={`/reviews/${review.id}`}
						class="absolute right-1 top-1 flex rounded-md p-2 text-wls-primary underline underline-offset-2 hover:text-wls-secondary"
					>
						Read More
						<ExternalLink class="ml-1 size-4" />
					</a>
				</div>
			{/each}
		{/if}
	</div>
	<div class="flex items-center justify-center gap-4 text-wls-primary-foreground">
		<button
			class="flex items-center rounded bg-wls-primary p-2 hover:bg-wls-secondary disabled:bg-wls-muted"
			disabled={!reviews.previousPage}
			onclick={() => loadReviews(params.page - 1)}
		>
			<ArrowLeft class="size-6" />
		</button>
		<span class="text-wls-foreground">
			Page {params.page} of {reviews.totalPages}
		</span>
		<button
			class="flex items-center rounded bg-wls-primary p-2 hover:bg-wls-secondary disabled:bg-wls-muted"
			disabled={!reviews.nextPage}
			onclick={() => loadReviews(params.page + 1)}
		>
			<ArrowRight class="size-6" />
		</button>
	</div>
</section>
