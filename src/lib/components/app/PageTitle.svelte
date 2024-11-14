<script lang="ts">
	import { ChevronLeft } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	let { children, back }: { children: Snippet; back?: string } = $props();
</script>

{#if back}
	<div class="mb-5 flex items-center justify-start gap-2">
		<a href={back} class="p-2 pt-3">
			<ChevronLeft className="size-24" />
		</a>

		<h2 class="text-3xl font-bold">
			{@render children()}
		</h2>
	</div>
{:else}
	<h2 class="mb-5 text-3xl font-bold">
		{@render children()}
	</h2>
{/if}
