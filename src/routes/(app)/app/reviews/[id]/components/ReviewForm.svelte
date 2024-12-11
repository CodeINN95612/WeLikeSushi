<script lang="ts">
	import { enhance } from '$app/forms';
	import { Label } from '$lib/components/ui/label';
	import type { RubricView } from '$lib/models/rubric/RubricView';
	import type { ReviewView } from '$lib/models/reviews/ReviewView';
	import RubricInputList from './RubricInputList.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Popover from '$lib/components/ui/popover';
	import { CalendarIcon, Save, Trash } from 'lucide-svelte';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Alert } from '$lib/components/ui/alert';
	import { page } from '$app/stores';

	let queryParams = queryParameters({
		restaurant_id: ssp.string()
	});

	type Props = {
		rubric: RubricView[];
		restaurants: { value: string; label: string }[];
		reviewers: { value: string; label: string }[];
	};

	const now = new Date();
	const id = $page.params.id;
	let { rubric, restaurants, reviewers }: Props = $props();
	let review = $state<ReviewView>({
		id: '',
		review: '',
		rating: 0,
		restaurant: '',
		review_date: new Date().toString(),
		reviewer: ''
	});

	let loading = $state(false);
	let error = $state('');
	let selectedRestaurant = $state(queryParams.restaurant_id ?? '');
	let selectedReviewer = $state('');

	const restaurantsTriggerContent = $derived(
		restaurants.find((r) => r.value === selectedRestaurant)?.label ?? 'Select a restaurant'
	);

	const reviewersTriggerContent = $derived(
		reviewers.find((r) => r.value === selectedReviewer)?.label ?? 'Select a reviewer'
	);

	const df = new DateFormatter('es-EC', {
		dateStyle: 'long'
	});
	let selectedDate = $state<DateValue | undefined>(
		new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
	);
	let dateContentRef = $state<HTMLElement | null>(null);

	async function submit(e: SubmitEvent) {
		loading = true;
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: formData
			});

			if (!response.ok) {
				if (response.status >= 300 && response.status < 308) {
					return;
				}

				error = 'Unknown error occurred with status: ' + response.status;
				return;
			}
		} catch (e) {
			error = "Couldn't save review";
		} finally {
			loading = false;
		}
	}
</script>

{#if error}
	<Alert variant="destructive">{error}</Alert>
{/if}

<form onsubmit={submit} class="max-w-4xl" use:enhance method="POST" action="?/save">
	<div class="grid h-auto grid-cols-1 gap-4 md:grid-cols-2">
		<div class="space-y-4">
			<div class="flex items-center gap-4">
				<Label for="restaurant">Restaurant</Label>
				<Select.Root
					type="single"
					name="restaurant"
					bind:value={selectedRestaurant}
					disabled={queryParams.restaurant_id !== null}
				>
					<Select.Trigger class="ml-auto w-[250px]">
						{restaurantsTriggerContent}
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						<Select.Group>
							<Select.GroupHeading>Restaurants</Select.GroupHeading>
							{#each restaurants as restaurant (restaurant.value)}
								<Select.Item value={restaurant.value} label={restaurant.label}
									>{restaurant.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex items-center gap-4">
				<Label for="reviewer">Reviewer</Label>
				<Select.Root type="single" name="reviewer" bind:value={selectedReviewer}>
					<Select.Trigger class="ml-auto w-[250px]">
						{reviewersTriggerContent}
					</Select.Trigger>
					<Select.Content class="max-h-[200px]">
						<Select.Group>
							<Select.GroupHeading>Reviewers</Select.GroupHeading>
							{#each reviewers as reviewer (reviewer.value)}
								<Select.Item value={reviewer.value} label={reviewer.label}
									>{reviewer.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex items-center gap-4">
				<Label for="review_date">Visit Date</Label>
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({
								variant: 'outline',
								class: 'ml-auto w-[250px] justify-start text-left font-normal'
							}),
							!selectedDate && 'text-muted-foreground'
						)}
						name="review_date"
					>
						<CalendarIcon />
						{selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={dateContentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={selectedDate} />
					</Popover.Content>
				</Popover.Root>
			</div>
			<RubricInputList {rubric} name="rubric" id="rubric" />
		</div>
		<div class="flex">
			<div class="flex h-full w-full flex-col space-y-4">
				<Label>Details</Label>
				<Textarea bind:value={review.review} class="h-full resize-none" />
			</div>
		</div>
	</div>
	<div class="mt-4 flex justify-start gap-4">
		<Button variant="default" type="submit" class="aspect-square">
			<Save class="size-6" />
		</Button>
		{#if id !== 'new'}
			<Button variant="destructive" type="submit" class="aspect-square" formaction="?/delete">
				<Trash class="size-6" />
			</Button>
		{/if}
	</div>
</form>
