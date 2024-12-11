import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase.types.ts';

export type WeLikeSushiDatabase = SupabaseClient<Database, 'public', Database['public']>;
