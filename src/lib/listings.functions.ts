import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export const fetchListings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_approved", true)
    .order("rating", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const fetchListingById = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: listing, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return listing;
  });