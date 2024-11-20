// See https://svelte.dev/docs/kit/types#app.d.ts
import { WeLikeSushiDatabase } from '$lib/data/types';
import type { Session, User } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: WeLikeSushiDatabase;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
