<script lang="ts">
	import type { RubricView } from '$lib/models/rubric/RubricView';

	type Props = {
		rubric: RubricView[];
		id: string;
		name: string;
	};
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let { rubric, id, name }: Props = $props();
	let rubricValues = $state(
		rubric.map((r) => ({
			id: r.id,
			name: r.name,
			description: r.description,
			value: 0
		}))
	);
	let rubricValuesJson = $derived(JSON.stringify(rubricValues));
</script>

<div class="grid rounded-md border-2">
	<h3 class="border-b p-4 text-xl font-bold">
		Rubric
		<span class="text-sm font-thin"> (/10)</span>
	</h3>
	<input type="text" hidden {id} {name} value={rubricValuesJson} />
	{#each rubricValues as item, index (item.id)}
		<div class="flex items-end justify-center p-4 hover:bg-muted/50">
			<div class="flex-1">
				<Label for="rubric-{index}" class="">
					<span class="font-normal text-primary">
						{`${index + 1}. `}
					</span>
					{item.name}:
				</Label>
				<p class="pl-4 text-xs text-secondary-foreground">{item.description}</p>
			</div>
			<Input
				type="number"
				id="rubric-{index}"
				min="0"
				max="10"
				step="1"
				class="ml-auto w-[70px]"
				bind:value={item.value}
			/>
		</div>
	{/each}
</div>
