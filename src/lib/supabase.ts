import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL="https://binohqobswgaznnhogsn.supabase.co"
const SUPABASE_PUBLIC_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbm9ocW9ic3dnYXpubmhvZ3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2NzcwOTMsImV4cCI6MjAyNjI1MzA5M30.AYRRtfz5U__Jyalsy7AQxXrnjKr4eNooJUxnI51A6kk"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
