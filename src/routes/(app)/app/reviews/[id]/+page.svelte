<script lang="ts">
	import PageTitle from '$lib/components/app/PageTitle.svelte';
	import { Alert } from '$lib/components/ui/alert';
	import type { PageData } from './$types';
	import ReviewForm from './components/ReviewForm.svelte';

	let { data }: { data: PageData } = $props();
</script>

<PageTitle back="/app/reviews">Review</PageTitle>

{#if data.error}
	<Alert variant="destructive">Error: {data.error}</Alert>
{:else}
	<ReviewForm rubric={data.rubric!} restaurants={data.restaurants!} reviewers={data.reviewers!} />
{/if}
