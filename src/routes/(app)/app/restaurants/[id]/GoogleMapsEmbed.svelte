<script lang="ts">
	import { Map } from 'lucide-svelte';

	let { url }: { url: string | null } = $props();
</script>

{#if url && url.startsWith('https://www.google.com/maps/embed?pb=')}
	<!-- Google -->
	<div class="">
		<iframe
			title="Google Maps Url"
			src={url}
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			class="min-h-[300px] w-full rounded-lg"
		></iframe>
	</div>
{:else}
	<div
		class="flex min-h-[300px] w-full items-center justify-center rounded-lg bg-muted text-secondary-foreground"
	>
		<Map class="size-24" />
	</div>
{/if}
