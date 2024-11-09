<script lang="ts">
	import { writable } from 'svelte/store';
	import { PencilIcon, TrashIcon } from 'lucide-svelte';

	let items = writable([{ id: 1, text: 'Sample Item' }]);
	let newItemText = '';

	function addItem() {
		items.update((currentItems) => [...currentItems, { id: Date.now(), text: newItemText }]);
		newItemText = '';
	}

	function deleteItem(id: number) {
		items.update((currentItems) => currentItems.filter((item) => item.id !== id));
	}
</script>

<div class="p-4">
	<button class="mb-4 rounded bg-blue-500 px-4 py-2 text-white" onclick={addItem}>
		Add Item
	</button>
	<ul class="space-y-2">
		{#each $items as item (item.id)}
			<li class="flex items-center space-x-2">
				<input type="text" class="flex-1 border p-2" bind:value={item.text} />
				<button class="text-gray-500" onclick={() => deleteItem(item.id)}>
					<TrashIcon class="h-5 w-5" />
				</button>
				<button class="text-gray-500">
					<PencilIcon class="h-5 w-5" />
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	/* Add any additional styles here */
</style>
