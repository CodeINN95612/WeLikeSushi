import { createClient } from '@supabase/supabase-js';
import { type Database } from '$lib/supabase.types';
import { env } from '$env/dynamic/public';
import { env as private_env } from '$env/dynamic/private';

const { PUBLIC_SUPABASE_URL } = env;
const { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } = private_env;

if (!PUBLIC_SUPABASE_URL || !PRIVATE_SUPABASE_SERVICE_ROLE_KEY) {
	throw new Error('Missing Supabase environment variables');
}

export const supabase_admin = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);
