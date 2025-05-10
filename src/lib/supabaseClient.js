import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;; // замени на своё
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY; // замени на своё
export const supabase = createClient(supabaseUrl, supabaseKey);