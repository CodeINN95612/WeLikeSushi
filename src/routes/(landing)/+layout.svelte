<script lang="ts">
	import LandingHeader from '$lib/components/landing/LandingHeader.svelte';
	let { children } = $props();
</script>

<div class="landing">
	<LandingHeader />
	{@render children()}
</div>

<style>
	.landing {
		@apply bg-zinc-50 text-zinc-900;
	}
</style>
