<script lang="ts">
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
	import type { CreateReviewView } from '$lib/models/reviews/CreateReviewView';
	import { goto } from '$app/navigation';
	import { type StatusResponseData } from '$lib/models/common/StatusResponseData';
	import { onMount } from 'svelte';
	import { type GetReviewView } from '$lib/models/reviews/GetReviewView';

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

	let scores = $state<
		{
			id: string;
			name: string;
			description: string;
			value: number;
		}[]
	>([]);

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

	async function save() {
		loading = true;
		try {
			if (!selectedRestaurant || !selectedReviewer || !selectedDate) {
				error = 'Please fill all fields';
				return;
			}

			for (const score of scores) {
				if (score.value < 0 || score.value > 10) {
					error = 'Scores must be between 0 and 10';
					return;
				}
			}

			if (!review.review) {
				error = 'Please fill all fields';
				return;
			}

			const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			var newReview: CreateReviewView = {
				id: id,
				review: review.review,
				restaurant_id: selectedRestaurant,
				reviewer: selectedReviewer,
				visit_date: selectedDate.toDate(currentTimeZone),
				rubric: scores.map((s) => ({
					id: s.id,
					score: s.value
				}))
			};

			var res = await fetch('/api/app/reviews', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newReview)
			});

			if (!res.ok) {
				const data = await res.json();
				if ('error' in data) {
					error = data.error;
				} else {
					error = 'An error occurred';
				}
			} else {
				const data = (await res.json()) as StatusResponseData<{ id: string }>;
				if (data.success) {
					await goto(`/app/reviews/${data.value.id}`);
				} else {
					error = 'An error occurred';
				}
			}
		} catch (e) {
			error = "Couldn't save review";
		} finally {
			loading = false;
		}
	}

	async function deleteReview() {
		loading = true;
		try {
			var res = await fetch(`/api/app/reviews/${id}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				await goto('/app/reviews');
			}

			var data = (await res.json()) as StatusResponseData<unknown>;
			if (!data.success) {
				error = data.error;
			}
		} catch (e) {
			error = "Couldn't delete review";
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		loading = true;
		try {
			scores = rubric.map((r) => ({
				id: r.id,
				name: r.name,
				description: r.description,
				value: 0
			}));

			if (id === 'new') {
				return;
			}

			const res = await fetch(`/api/app/reviews/${id}`, {
				method: 'GET'
			});

			if (!res.ok) {
				error = "Couldn't load review";
				return;
			}

			const data = (await res.json()) as StatusResponseData<GetReviewView>;

			if (!data.success) {
				error = data.error;
				return;
			}

			var date = new Date(data.value.visit_date);
			review = {
				id: data.value.id,
				review: data.value.review,
				restaurant: data.value.restaurant_id,
				reviewer: data.value.reviewer,
				review_date: date.toString(),
				rating: 0
			};

			selectedRestaurant = data.value.restaurant_id;
			selectedReviewer = data.value.reviewer;
			selectedDate = new CalendarDate(
				date.getUTCFullYear(),
				date.getUTCMonth() + 1,
				date.getUTCDate()
			);

			scores = data.value.rubric.map((r) => {
				const rubricElement = rubric.find((rub) => rub.id === r.id);
				return {
					id: r.id,
					name: rubricElement?.name ?? '',
					description: rubricElement?.description ?? '',
					value: r.score
				};
			});

			for (const rubricElement of rubric) {
				if (!scores.find((s) => s.id === rubricElement.id)) {
					scores.push({
						id: rubricElement.id,
						name: rubricElement.name,
						description: rubricElement.description,
						value: 0
					});
				}
			}
		} catch (e) {
			error = "Couldn't load review";
		} finally {
			loading = false;
		}
	});
</script>

{#if error}
	<Alert variant="destructive" class="my-4 max-w-4xl">{error}</Alert>
{/if}

{#if loading}
	<Alert>Loading...</Alert>
{:else}
	<form class="max-w-4xl">
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
							<Calendar type="single" bind:value={selectedDate} id="review_date" />
						</Popover.Content>
					</Popover.Root>
				</div>
				<RubricInputList bind:rubricValues={scores} name="rubric" id="rubric" />
			</div>
			<div class="flex">
				<div class="flex h-full w-full flex-col space-y-4">
					<Label>Details</Label>
					<Textarea bind:value={review.review} class="h-full resize-none" required />
				</div>
			</div>
		</div>
		<div class="mt-4 flex justify-start gap-4">
			<Button variant="default" type="button" class="aspect-square" onclick={() => save()}>
				<Save class="size-6" />
			</Button>
			{#if id !== 'new'}
				<Button
					variant="destructive"
					type="button"
					class="aspect-square"
					onclick={() => deleteReview()}
				>
					<Trash class="size-6" />
				</Button>
			{/if}
		</div>
	</form>
{/if}
