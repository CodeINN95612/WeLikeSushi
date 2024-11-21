<script>
	import WeLikeSushi from '$lib/components/app/WeLikeSushi.svelte';
</script>

<div class="fixed left-0 right-0 top-0 z-50 mx-auto max-w-4xl p-4">
	<nav
		class="text-wls-foreground bg-wls-background border-wls-foreground flex items-center justify-between rounded-xl border-b border-t p-4"
	>
		<WeLikeSushi href="/" class="hover:text-wls-secondary" />
		<div class="flex space-x-10">
			<a href="/" class="hover:text-wls-primary">Home</a>
			<a href="/about" class="hover:text-wls-primary">About</a>
			<a href="/contact" class="hover:text-wls-primary">Contact</a>
		</div>
		<a
			class="bg-wls-primary text-wls-primary-foreground hover:bg-wls-accent hover:text-wls-accent-foreground rounded-lg px-4 py-2 font-semibold"
			href="/login"
		>
			Login
		</a>
	</nav>
</div>
