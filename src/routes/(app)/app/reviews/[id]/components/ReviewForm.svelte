<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { RubricView } from '$lib/models/rubric/RubricView';
	import type { ReviewView } from '$lib/models/reviews/ReviewView';
	import RubricInputList from './RubricInputList.svelte';

	type Props = {
		rubric: RubricView[];
	};

	let { rubric }: Props = $props();
	let review = $state<ReviewView>();

	async function submitSave() {}
</script>

<form onsubmit={submitSave} use:enhance class="max-w-xl">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div id="right">
			<RubricInputList {rubric} name="rubric" id="rubric" />
		</div>
		<div id="left">
			<div class="">
				<Label>Details</Label>
				<textarea class="h-32 w-full"></textarea>
			</div>
		</div>
	</div>
</form>
