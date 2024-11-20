<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	onMount(() => {
		const { data: state } = data.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => state.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
{@render children()}
