<script lang="ts">
	import { type Component, type Snippet } from 'svelte';

	let {
		children,
		href
	}: {
		children: Snippet;
		href: string;
	} = $props();
</script>

<a
	{href}
	class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
>
	{@render children()}
</a>
