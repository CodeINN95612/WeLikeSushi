<script lang="ts">
	import { ChartBarIncreasing, ChefHat, House, Star } from 'lucide-svelte';
	import { type Snippet } from 'svelte';
	import NavItem from './NavItem.svelte';
</script>

<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
	<NavItem href="/app">
		<House class="h-4 w-4" />
		Dashboard
	</NavItem>
	<NavItem href="/app/restaurants">
		<ChefHat class="h-4 w-4" />
		Restaurants
	</NavItem>
	<NavItem href="/app/reviews">
		<Star class="h-4 w-4" />
		Reviews
	</NavItem>
	<NavItem href="/app/rubric">
		<ChartBarIncreasing class="h-4 w-4" />
		Rubric
	</NavItem>
</nav>
