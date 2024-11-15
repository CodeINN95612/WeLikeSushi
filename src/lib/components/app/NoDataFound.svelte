<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	type Props = {
		data_title: string;
		new_url: string;
	};

	let { data_title, new_url }: Props = $props();
</script>

<div class="my-5 space-y-2">
	<p class="text-xl font-semibold">No {data_title} found</p>
	<Button variant="default" href={new_url} class="w-48">Add New</Button>
</div>
