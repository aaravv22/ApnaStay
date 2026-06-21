import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const body = await request.json() as { messages: { role: string; content: string }[] };

        // Fetch live listing context so the assistant can answer
        // "best PG under 6k in Pune" style questions with real data.
        let listingsContext = "";
        try {
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } },
          );
          const { data } = await supabase
            .from("listings")
            .select("id,type,title,city,address,price_monthly,price_daily,price_slot,rating,review_count,amenities,is_verified")
            .eq("is_approved", true)
            .order("rating", { ascending: false })
            .limit(60);
          if (data?.length) {
            listingsContext =
              "\n\nLIVE LISTINGS (use these to answer; never invent listings):\n" +
              data.map((l: any) => {
                const price = l.price_monthly
                  ? `₹${l.price_monthly}/mo`
                  : l.price_daily
                  ? `₹${l.price_daily}/day`
                  : l.price_slot
                  ? `₹${l.price_slot}/slot`
                  : "price on request";
                return `- [${l.type}] ${l.title} · ${l.city} · ${price} · ⭐${l.rating} (${l.review_count}) · amenities: ${(l.amenities || []).join(", ") || "—"} · ${l.is_verified ? "✅ verified" : "unverified"} · /listing/${l.id}`;
              }).join("\n");
          }
        } catch (e) {
          // Continue without listings context if DB read fails.
          console.error("[chat] listings fetch failed", e);
        }

        const systemPrompt = `You are ApnaStay's AI campus living assistant for Indian college students. You help them discover hostels, PGs, gyms, libraries, mess services and cafes near their college.

Your job:
- Recommend SPECIFIC listings from the live catalog below when the user gives a budget, city, college, or category.
- Compare options: price, rating, amenities, verified badge, distance to college if mentioned.
- For PG/hostel queries, also remind students about extras (security deposit, mess charges, electricity, WiFi).
- Be warm and concise. Use ₹ for prices. Use bullet points for comparisons.
- When you mention a listing, include its link like /listing/<id> so the student can open it.
- If nothing in the catalog matches, suggest closest alternatives and what filter to relax.
- Keep replies short (under ~6 short lines) unless the user asks for detail.${listingsContext}`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: systemPrompt }, ...body.messages],
            stream: true,
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          return new Response(text, { status: upstream.status });
        }
        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});