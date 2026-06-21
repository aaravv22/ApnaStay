import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { ListingCard, type Listing } from "@/components/shared/ListingCard";
import { CampusMap } from "@/components/map/CampusMap";
import { CATEGORIES, CATEGORY_KEYS, type CategoryKey } from "@/lib/categories";
import { fetchListings } from "@/lib/listings.functions";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";

const listingsQuery = queryOptions({ queryKey: ["listings"], queryFn: () => fetchListings() });

type SearchParams = { cat?: CategoryKey; q?: string };

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Explore — ApnaStay" }, { name: "description", content: "Browse hostels, PGs, gyms, libraries and cafes near your college on a live map." }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    cat: (CATEGORY_KEYS as string[]).includes(s.cat as string) ? (s.cat as CategoryKey) : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listingsQuery),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseQuery(listingsQuery);
  const search = Route.useSearch();
  const listings = data as Listing[];
  const [active, setActive] = useState<Set<CategoryKey>>(
    () => new Set(search.cat ? [search.cat] : CATEGORY_KEYS),
  );
  const [query, setQuery] = useState(search.q ?? "");
  const [debounced, setDebounced] = useState(query);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sort, setSort] = useState<"rating" | "price_asc" | "price_desc" | "newest">("rating");

  // Sync from URL when ?cat changes
  useEffect(() => {
    if (search.cat) setActive(new Set([search.cat]));
  }, [search.cat]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const arr = listings.filter((l) => {
      if (!active.has(l.type)) return false;
      const p = l.price_monthly ?? l.price_daily ?? l.price_slot ?? 0;
      if (p > maxPrice) return false;
      if (q) {
        const hay = `${l.title} ${l.city} ${l.address} ${(l as any).description ?? ""} ${l.type} ${l.amenities?.join(" ") ?? ""}`.toLowerCase();
        // multi-token match: every word in query must be found
        const tokens = q.split(/\s+/).filter(Boolean);
        if (!tokens.every((t: string) => hay.includes(t))) return false;
      }
      return true;
    });
    const priceOf = (l: Listing) => l.price_monthly ?? l.price_daily ?? l.price_slot ?? 0;
    if (sort === "price_asc") arr.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === "price_desc") arr.sort((a, b) => priceOf(b) - priceOf(a));
    else if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [listings, active, debounced, maxPrice, sort]);

  function toggle(k: CategoryKey) {
    const s = new Set(active);
    s.has(k) ? s.delete(k) : s.add(k);
    if (s.size === 0) CATEGORY_KEYS.forEach((c) => s.add(c));
    setActive(s);
  }

  const onlyCat = active.size === 1 ? Array.from(active)[0] : null;
  const onlyLabel = onlyCat ? CATEGORIES[onlyCat].label : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-semibold">
              {onlyLabel ? `${onlyLabel} near you` : "Explore near you"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} spaces match your filters</p>
          </div>
          <div className="glass rounded-xl flex items-center gap-2 px-3 py-2 w-full md:w-80">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={onlyLabel ? `Search ${onlyLabel.toLowerCase()} by city, area, amenity...` : "Search city, area, amenity..."}
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search"><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORY_KEYS.map((k) => {
            const c = CATEGORIES[k]; const Icon = c.icon; const on = active.has(k);
            return (
              <button key={k} onClick={() => toggle(k)} className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition ${on ? "bg-saffron text-navy-deep" : "glass hover:bg-white/10"}`}>
                <Icon className="h-3.5 w-3.5" style={on ? undefined : { color: c.color }} /> {c.label}
              </button>
            );
          })}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="ml-auto glass rounded-full px-3 py-1.5 text-xs bg-transparent outline-none cursor-pointer"
            aria-label="Sort by"
          >
            <option value="rating" className="bg-navy-deep">Top rated</option>
            <option value="price_asc" className="bg-navy-deep">Price: low → high</option>
            <option value="price_desc" className="bg-navy-deep">Price: high → low</option>
          </select>
          <div className="flex items-center gap-3 ml-auto glass rounded-full px-4 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Max ₹{maxPrice.toLocaleString("en-IN")}</span>
            <div className="w-32"><Slider value={[maxPrice]} max={20000} min={500} step={500} onValueChange={(v) => setMaxPrice(v[0])} /></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 mb-12">
          <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
              {filtered.length === 0 && (
                <div className="col-span-2 glass rounded-2xl p-10 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="font-semibold mb-1">No spaces match your filters</div>
                  <div className="text-sm text-muted-foreground mb-4">Try widening the price range, clearing the search, or picking another category.</div>
                  <button onClick={() => { setQuery(""); setMaxPrice(20000); setActive(new Set(CATEGORY_KEYS)); }} className="text-sm text-saffron hover:underline">Reset filters</button>
                </div>
              )}
            </div>
          </div>
          <div className="h-[70vh] lg:sticky lg:top-20">
            <CampusMap listings={filtered} activeCategories={active} />
          </div>
        </div>
      </div>
    </div>
  );
}