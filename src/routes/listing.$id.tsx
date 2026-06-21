import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { CampusMap } from "@/components/map/CampusMap";
import { CATEGORIES, CATEGORY_KEYS } from "@/lib/categories";
import { fetchListingById } from "@/lib/listings.functions";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star, MapPin, BadgeCheck, MessageCircle, Share2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { openApnaChat } from "@/components/chat/AIChatBubble";

const q = (id: string) => queryOptions({ queryKey: ["listing", id], queryFn: () => fetchListingById({ data: { id } }) });

export const Route = createFileRoute("/listing/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(q(params.id)),
  head: ({ params }) => ({ meta: [{ title: `Listing — ApnaStay` }, { name: "description", content: `View details and book this space on ApnaStay.` }] }),
  notFoundComponent: () => <div className="pt-32 text-center">Listing not found</div>,
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(q(id));
  if (!data) throw notFound();
  const l = data as any;
  const cat = CATEGORIES[l.type as keyof typeof CATEGORIES];
  const Icon = cat.icon;
  const price = l.price_monthly ?? l.price_daily ?? l.price_slot;
  const unit = l.price_monthly ? "/month" : l.price_daily ? "/day" : "/slot";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-3xl overflow-hidden mb-8">
          <img src={l.images[0]} alt={l.title} className="md:col-span-2 h-96 w-full object-cover" />
          <div className="grid grid-rows-2 gap-2">
            <img src={l.images[1] ?? l.images[0]} alt="" className="h-full w-full object-cover" />
            <div className="relative">
              <img src={l.images[0]} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm">+{Math.max(0, l.images.length - 2)} photos</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs glass flex items-center gap-1.5"><Icon className="h-3 w-3" style={{ color: cat.color }} />{cat.label.slice(0,-1)}</span>
              {l.is_verified && <span className="px-2.5 py-1 rounded-full text-xs bg-saffron/90 text-navy-deep flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Verified</span>}
            </div>
            <h1 className="text-4xl font-display font-semibold">{l.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {l.address}, {l.city}</span>
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-saffron text-saffron" /> {l.rating} · {l.review_count} reviews</span>
            </div>

            <h2 className="text-xl font-semibold mt-10 mb-3">About this space</h2>
            <p className="text-muted-foreground leading-relaxed">{l.description}</p>

            <h2 className="text-xl font-semibold mt-10 mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {l.amenities.map((a: string) => (
                <div key={a} className="glass rounded-xl px-3 py-2 text-sm">{a}</div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-10 mb-3">Location</h2>
            <div className="h-80">
              <CampusMap listings={[l]} activeCategories={new Set(CATEGORY_KEYS)} center={{ lat: l.lat, lng: l.lng }} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-semibold text-gradient-saffron">₹{price?.toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
              <Button onClick={() => toast.success("Booking flow coming in the next update!")} className="w-full mt-5 bg-saffron hover:bg-saffron-glow text-navy-deep font-semibold h-12">
                <Calendar className="mr-2 h-4 w-4" /> Book now
              </Button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  className="bg-white/5"
                  onClick={() =>
                    openApnaChat({
                      id: l.id,
                      type: l.type,
                      title: l.title,
                      city: l.city,
                      address: l.address,
                      price: price ?? null,
                      unit,
                      amenities: l.amenities,
                    })
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat
                </Button>
                <Button variant="outline" className="bg-white/5" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">No charge until booking is confirmed</p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}