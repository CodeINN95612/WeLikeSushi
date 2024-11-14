<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import type { RestaurantImage } from '$lib/models/RestaurantImage';
	import { Image, X } from 'lucide-svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	type DeleteHandler = (id: string | number) => Promise<void> | void;

	type Props = {
		oldImages: RestaurantImage[];
		id: string;
		name: string;
		label: string;
		deleteOldImage: DeleteHandler;
	};

	let { oldImages, id, name, deleteOldImage, label }: Props = $props();
	let newImages: File[] = $state([]);

	let imageUrlsAsJson = $derived(JSON.stringify(oldImages.map((image) => image.url)));
	let imagesLength = $derived(oldImages.length + newImages.length);

	const handleNewImages: ChangeEventHandler<HTMLInputElement> = (event) => {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			newImages.push(...Array.from(target.files));
		}
	};
</script>

{#snippet ImageElement(id: string | number, url: string, alt: string, onDelete: DeleteHandler)}
	<div class="relative">
		<img class="aspect-square object-cover" src={url} {alt} />
		<button
			type="button"
			class="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
			onclick={async () => {
				if (typeof id === 'string') {
					await onDelete(id as string);
				} else {
					onDelete(id as number);
				}
			}}
		>
			<X class="m-0 size-4" />
		</button>
	</div>
{/snippet}

<div class="">
	<input type="text" hidden value={imageUrlsAsJson} id="oldImages" name="oldImages" />
	<Label for={id}>{label}</Label>
	<Input type="file" {id} {name} multiple accept="image/*" onchange={handleNewImages} />
</div>

{#if imagesLength > 0}
	<div class="grid w-full grid-cols-2 overflow-hidden rounded-lg bg-muted">
		{#each oldImages as oldImage (oldImage.id)}
			{@render ImageElement(oldImage.id, oldImage.url, oldImage.description, deleteOldImage)}
		{/each}
		{#each newImages as newImage, index (newImage.name)}
			{@render ImageElement(
				index,
				URL.createObjectURL(newImage),
				'Restaurant',
				(id: number | string) => {
					newImages.splice(id as number, 1);
				}
			)}
		{/each}
	</div>
{:else}
	<div
		class="flex h-[300px] w-full items-center justify-center rounded-lg bg-muted text-secondary-foreground"
	>
		<Image class="size-24" />
	</div>
{/if}
