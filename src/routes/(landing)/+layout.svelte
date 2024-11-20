<script lang="ts">
	import WeLikeSushi from '$lib/components/app/WeLikeSushi.svelte';
	let { children } = $props();
</script>

<div class="bg-wls-background">
	<div class="">
		<nav class="text-wls-foreground mx-auto flex max-w-4xl items-center justify-between p-4">
			<WeLikeSushi href="/" class="hover:text-wls-secondary" />
			<div class="flex space-x-10">
				<a href="/" class="hover:text-wls-primary">Home</a>
				<a href="/about" class="hover:text-wls-primary">About</a>
				<a href="/contact" class="hover:text-wls-primary">Contact</a>
			</div>
			<a
				class="bg-wls-primary text-wls-primary-foreground hover:bg-wls-accent hover:text-wls-accent-foreground rounded-lg px-4 py-2"
				href="/login"
			>
				Login
			</a>
		</nav>
	</div>
	<main>
		{@render children()}
	</main>
	<footer class="text-wls-foreground mx-auto flex max-w-4xl items-center justify-between p-4">
		<p>&copy; 2024 We Like Sushi</p>
		<div class="flex space-x-10">
			<a href="/terms" class="hover:text-wls-primary">Terms</a>
			<a href="/privacy" class="hover:text-wls-primary">Privacy</a>
		</div>
	</footer>
</div>
