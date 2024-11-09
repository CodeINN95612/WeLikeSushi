<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
</script>

<Card.Root class="mx-auto mt-16 w-[350px]">
	<Card.Header>
		<Card.Title>Login</Card.Title>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="space-y-4">
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input type="email" id="email" name="email" required />
			</div>
			<div class="space-y-2">
				<Label for="password">Password</Label>
				<Input type="password" id="password" name="password" required />
			</div>
			<Button type="submit" class="w-full">Login</Button>
		</form>
	</Card.Content>
</Card.Root>
