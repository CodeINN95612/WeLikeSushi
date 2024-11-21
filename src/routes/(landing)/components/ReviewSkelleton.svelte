<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();
</script>

<div class={twMerge('bg-wls-muted animate-pulse rounded-md', className)}></div>
