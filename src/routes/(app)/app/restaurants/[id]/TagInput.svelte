<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Input from '$lib/components/ui/input/input.svelte';
	import { X } from 'lucide-svelte';

	type Props = {
		tags: string[];
		id: string;
		name: string;
		required: boolean;
	};

	let { tags = $bindable(), id, required, name }: Props = $props();
	let tagsAsJson = $derived(JSON.stringify(tags));
	let newTag = $state('');
	let backspaceCount = $state(0);

	function removeTag(tag: string) {
		tags = tags.filter((t) => t !== tag);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			addTag();
		} else if (event.key === 'Backspace' && newTag === '') {
			backspaceCount = backspaceCount + 1;
			if (backspaceCount === 2) {
				removeTag(tags[tags.length - 1]);
				backspaceCount = 0;
			}
		}
	}

	function addTag() {
		const trimmedTag = newTag.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			tags.push(trimmedTag);
		}
		newTag = '';
	}
</script>

<div class="flex flex-wrap items-center gap-2 rounded-md border px-2 py-1">
	<input type="text" hidden value={tagsAsJson} {required} {id} {name} />
	{#each tags as tag (tag)}
		<Badge class="flex items-center justify-center pr-1" variant="secondary">
			{tag}
			<button
				class="ml-2 cursor-pointer border-none bg-none"
				type="button"
				onclick={() => removeTag(tag)}
			>
				<X class="size-3 p-0" />
			</button>
		</Badge>
	{/each}

	<input
		type="text"
		required={required && tags.length === 0}
		bind:value={newTag}
		placeholder="[Enter] for new tag..."
		onkeydown={handleKeyDown}
		class="border-none bg-background p-1 lowercase outline-none"
	/>
</div>
