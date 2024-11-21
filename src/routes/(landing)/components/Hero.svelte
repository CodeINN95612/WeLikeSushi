<script lang="ts">
	import { ArrowDown } from 'lucide-svelte';

	function scrollToReviews() {
		document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
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
			onclick={scrollToReviews}
			class="flex animate-bounce flex-col items-center justify-center rounded-lg pb-10"
		>
			<ArrowDown class="size-6" />
		</button>
	</div>
</section>
