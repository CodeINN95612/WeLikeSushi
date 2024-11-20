<script lang="ts">
	import SideNav from '$lib/components/app/SideNav.svelte';
	import ThemeToggle from '$lib/components/app/ThemeToggle.svelte';
	import WeLikeSushi from '$lib/components/app/WeLikeSushi.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	async function logout() {
		const { error } = await data.supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		invalidateAll();
	}
</script>

<div class="grid min-h-screen w-full md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
	<aside class="hidden border-r bg-muted/40 md:block">
		<div class="flex h-full max-h-screen flex-col gap-2">
			<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
				<WeLikeSushi />
			</div>
			<div class="flex-1">
				<SideNav />
			</div>
			<div class="mt-auto p-4">
				<ThemeToggle />
			</div>
		</div>
	</aside>
	<div class="flex h-screen flex-col">
		<header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
			<Button onclick={logout} variant="link">Log Out</Button>
		</header>
		<div class="flex-1 overflow-y-auto">
			<main class="container mt-10 pb-10">
				{@render children()}
			</main>
		</div>
	</div>
</div>
