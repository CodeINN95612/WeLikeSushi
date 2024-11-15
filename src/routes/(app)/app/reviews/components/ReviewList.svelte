<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { Input } from '$lib/components/ui/input';
	import { Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let searchQuery = $state('');

	type Props = {};

	let {}: Props = $props();

	onMount(async () => {
		//fetch from api/reviews
		var response = await fetch('api/reviews');
		var data = await response.json();

		if (response.ok) {
			console.log(data);
		} else {
			console.error(data);
		}
	});
</script>

<div class="flex gap-5">
	<Input type="text" placeholder="Search Restaurants..." class="w-48" bind:value={searchQuery} />
	<Button variant="ghost" href="reviews/new">
		<Plus />
	</Button>
</div>
