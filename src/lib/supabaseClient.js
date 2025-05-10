import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xufijrtocmymtwsyutoh.supabase.co'; // замени на своё
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZmlqcnRvY215bXR3c3l1dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODE3NTYsImV4cCI6MjA2MjQ1Nzc1Nn0.Y9nhtlyuGuGMlTDfZF88Dndk71p_BTvvQEjtQkBDD7E'; // замени на своё
export const supabase = createClient(supabaseUrl, supabaseKey);