import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — check your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Public image URL helper — bucket name has a space so we encode it
export function productImageUrl(filename) {
  return `${SUPABASE_URL}/storage/v1/object/public/product%20images/${encodeURIComponent(filename)}`;
}
