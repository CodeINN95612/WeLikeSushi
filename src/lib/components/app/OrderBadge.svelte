<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	type Props = {
		children: Snippet;
		selected?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement> | null | undefined;
	};

	let { children, selected = $bindable(false), onclick }: Props = $props();
</script>

{#if selected}
	<button
		{onclick}
		class="hover: inline-flex cursor-pointer items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground"
	>
		{@render children()}
	</button>
{:else}
	<button
		{onclick}
		class="inline-flex cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-xs font-medium hover:bg-secondary hover:text-secondary-foreground"
	>
		{@render children()}
	</button>
{/if}
