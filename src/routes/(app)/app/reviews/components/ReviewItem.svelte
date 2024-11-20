<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { ReviewView } from '$lib/models/reviews/ReviewView';

	type Props = {
		review: ReviewView;
	};
	import { goto } from '$app/navigation';

	let { review }: Props = $props();

	async function navigateToItem() {
		await goto(`reviews/${review.id}`);
	}
</script>

<Card.Root class="w-[450px] cursor-pointer hover:bg-muted/50" onclick={navigateToItem}>
	<Card.Header class="flex flex-row items-center justify-between">
		<Card.Title>{review.restaurant}</Card.Title>
		<Card.Description>
			{new Date(review.review_date).toLocaleDateString()}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<p class="text-sm">{review.review}</p>
	</Card.Content>
	<Card.Footer>
		<div class="flex items-center">
			<span class="ml-2">{review.rating} / 10</span>
		</div>
		<span class="ml-auto text-xs">- {review.reviewer}</span>
	</Card.Footer>
</Card.Root>
