<script lang="ts">
	import WeLikeSushi from '$lib/components/app/WeLikeSushi.svelte';
	import Footer from './components/Footer.svelte';
	import Nav from './components/Nav.svelte';
	let { children } = $props();
</script>

<div class="bg-wls-background text-wls-foreground">
	<Nav />
	<main class="mx-auto max-w-4xl px-4">
		{@render children()}
	</main>
	<Footer />
</div>
