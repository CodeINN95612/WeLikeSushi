<script lang="ts">
	import NavItem from '$lib/components/app/NavItem.svelte';
	import SideNav from '$lib/components/app/SideNav.svelte';
	import WeLikeSushi from '$lib/components/app/WeLikeSushi.svelte';
	import { Button } from '$lib/components/ui/button';
	import { House, ChefHat } from 'lucide-svelte';

	let { children } = $props();
</script>

<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<aside class="hidden border-r bg-muted/40 md:block">
		<div class="flex h-full max-h-screen flex-col gap-2">
			<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<WeLikeSushi />
			</div>
			<div class="flex-1">
				<SideNav />
			</div>
			<!-- <div class="mt-auto p-4">Bottom</div> -->
		</div>
	</aside>
	<div class="flex flex-col">
		<header
			class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
		></header>
		<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			{@render children()}
		</main>
	</div>
</div>
