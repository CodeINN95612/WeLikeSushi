<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import { Plus, Save, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/app/PageTitle.svelte';

	let { data }: { data: PageData } = $props();
	let rubric = $state(data.rubric ? data.rubric : []);
	let saveError = $state(null);

	let totalWeight = $derived(rubric.reduce((sum, item) => sum + item.weight, 0));
	let redText = $derived(totalWeight != 100 ? 'border border-red-500 text-red-500' : '');

	function addItem() {
		rubric.push({ id: crypto.randomUUID(), name: '', description: '', weight: 0 });
	}

	function deleteItem(id: string) {
		rubric = rubric.filter((item) => item.id !== id);
	}

	async function save() {
		try {
			const response = await fetch('/api/rubric', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ rubric })
			});

			var { success, error } = await response.json();
			if (!success) {
				saveError = error;
			} else {
				saveError = null;
			}
		} catch (error) {
			console.error('Error sending data:', error);
		}
	}
</script>

{#snippet ItemRow(item: (typeof rubric)[0])}
	<Table.Row>
		<Table.Cell>
			<Input type="text" bind:value={item.name} />
		</Table.Cell>
		<Table.Cell>
			<Input type="text" bind:value={item.description} />
		</Table.Cell>
		<Table.Cell>
			<Input type="number" min="0" max="100" step="1" class="text-right" bind:value={item.weight} />
		</Table.Cell>
		<Table.Cell class="items-middle hidden justify-center gap-1 sm:flex">
			<Button class="aspect-square p-0" variant="destructive" onclick={() => deleteItem(item.id)}>
				<Trash class="size-4" />
			</Button>
		</Table.Cell>
	</Table.Row>
{/snippet}

<PageTitle>Rubric</PageTitle>

<div class="mb-2 flex gap-4">
	<Button variant="secondary" onclick={() => save()}>
		<Save class="size-4" />
	</Button>
	<Button variant="outline" onclick={() => addItem()}>
		<Plus class="size-4" />
	</Button>
</div>

{#if saveError}
	<p class="m-2 text-red-500">{saveError}</p>
{/if}

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[200px]">Name</Table.Head>
				<Table.Head class="">Description</Table.Head>
				<Table.Head class="w-[120px]">
					Weight <span class="text-xs font-thin">(/100)</span>
				</Table.Head>
				<Table.Head class="hidden w-[150px] text-center sm:table-cell"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each rubric as item (item.id)}
				{@render ItemRow(item)}
			{/each}
		</Table.Body>
		<Table.Footer>
			<Table.Row>
				<Table.Cell></Table.Cell>
				<Table.Cell></Table.Cell>
				<Table.Cell>
					<Input
						class={`text-right ${redText}`}
						type="number"
						disabled
						value={$state.snapshot(totalWeight)}
					/>
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell"></Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
</div>
