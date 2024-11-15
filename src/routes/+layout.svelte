<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	let { children, layout }: { children: Snippet; layout: LayoutData } = $props();

	onMount(() => {
		const { data } = layout.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== layout.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
{@render children()}
