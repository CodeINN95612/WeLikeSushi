<script lang="ts">
	import { Rainbow } from 'lucide-svelte';
	import { twMerge } from 'tailwind-merge';
	type Props = {
		class?: string;
		href: string;
	};

	let { class: className, href }: Props = $props();
</script>

<a {href} class={twMerge('flex items-center gap-2 font-semibold', className)}>
	<Rainbow class="h-6 w-6" />
	<span class="">We Like Sushi</span>
</a>
