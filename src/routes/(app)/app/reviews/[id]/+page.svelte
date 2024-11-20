<script lang="ts">
	import PageTitle from '$lib/components/app/PageTitle.svelte';
	import type { RubricView } from '$lib/models/rubric/RubricView';
	import ReviewForm from './components/ReviewForm.svelte';

	const fakeRubric: RubricView[] = [
		{ id: '1', name: 'Service', description: 'How was the service?', weight: 40 },
		{ id: '2', name: 'Food', description: 'How was the food?', weight: 40 },
		{ id: '3', name: 'Ambiance', description: 'How was the ambiance?', weight: 20 }
	];
</script>

<PageTitle back="/app/reviews">Review</PageTitle>

<ReviewForm rubric={fakeRubric} />
