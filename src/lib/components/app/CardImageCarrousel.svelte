<script lang="ts">
	import type { RestaurantImage } from '$lib/models/restaurants/RestaurantImage';
	import { Image } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { images }: { images: RestaurantImage[] } = $props();

	let currentIndex = $state(0);

	function goToSlide(index: number) {
		currentIndex = index;
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function previousSlide() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	onMount(() => {
		const random = Math.floor(Math.random() * 100);
		const interval = setInterval(nextSlide, 3000 + random);
		return () => clearInterval(interval);
	});
</script>

{#if images.length === 0}
	<div class="flex h-full w-full flex-col items-center justify-center rounded-t-lg border">
		<Image />
		No images submited
	</div>
{:else if images.length === 1}
	<div class="flex h-full w-full items-center justify-center overflow-hidden rounded-t-lg">
		<img src={images[0].url} alt={images[0].description} />
	</div>
{:else}
	<div class="relative cursor-default">
		<div class="flex overflow-hidden rounded-t-lg">
			{#each images as image (image.id)}
				<div
					class="h-full w-full flex-shrink-0 transition-transform duration-500"
					style="transform: translateX({-currentIndex * 100}%)"
				>
					<div class="flex h-full w-full items-center justify-center rounded-t-lg">
						<img src={image.url} alt={image.description} />
					</div>
				</div>
			{/each}
		</div>

		<div class="absolute inset-x-0 bottom-0 flex justify-center space-x-2 bg-muted/75 py-1">
			{#each images as image, index (image.id)}
				<button
					aria-label="Go to slide"
					class="h-3 w-3 cursor-pointer rounded-full {index === currentIndex
						? 'bg-secondary-foreground'
						: 'bg-primary-foreground'}"
					onclick={() => goToSlide(index)}
				></button>
			{/each}
		</div>
	</div>
{/if}
