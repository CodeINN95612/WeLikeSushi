<script lang="ts">
	import type { ReviewView } from '$lib/models/reviews/ReviewView';
	import { ArrowDown, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-svelte';

	const reviews: ReviewView[] = [
		{
			id: '1',
			restaurant: 'Sushi Place',
			rating: 5,
			reviewer: 'John Doe',
			review_date: '2023-10-01',
			review: 'Amazing sushi, great service!'
		},
		{
			id: '2',
			restaurant: 'Sushi World',
			rating: 4,
			reviewer: 'Jane Smith',
			review_date: '2023-09-15',
			review: 'Good sushi, but a bit pricey.'
		}
	];

	function scrollToReviews() {
		const reviews = document.getElementById('reviews');
		if (reviews) {
			const windowHeight = window.innerHeight;
			const elementTop = reviews.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({
				top: elementTop - windowHeight / 10,
				behavior: 'smooth'
			});
		}
	}
</script>

<section class="h-screen">
	<div class="flex h-full flex-col">
		<div class="mt-auto h-1/2 text-center">
			<h2 class="mb-4 text-4xl font-bold">
				Bienvenido a
				<span class="text-wls-secondary">We Like Sushi</span>
			</h2>
			<p class="mb-8 text-lg">Enterate de los mejores lugares para comer sushi en tu ciudad</p>
		</div>
		<button
			class="flex animate-bounce flex-col items-center justify-center rounded-lg pb-10"
			onclick={scrollToReviews}
		>
			<ArrowDown class="size-6" />
		</button>
	</div>
</section>

<section id="reviews" class="min-h-screen space-y-8 py-10">
	<h3 class="text-2xl font-semibold">Restaurants</h3>
	<div class="">
		<input
			type="text"
			placeholder="Filter by restaurant..."
			class="bg-wls-card text-wls-foreground border-wls-border focus:border-wls-primary rounded border p-2 focus:outline-none"
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
		{#each reviews as review}
			<div
				class="border-wls-border bg-wls-card text-wls-foreground relative mb-4 flex items-center rounded-lg border-2 p-4"
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
	</div>
	<div class="text-wls-primary-foreground flex justify-center">
		<button class="bg-wls-primary hover:bg-wls-secondary mx-2 rounded p-2">
			<ArrowLeft class="size-6" />
		</button>
		<button class="bg-wls-primary hover:bg-wls-secondary mx-2 rounded p-2">
			<ArrowRight class="size-6" />
		</button>
	</div>
</section>
