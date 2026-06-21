import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, BadgeCheck } from "lucide-react";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { useState } from "react";

export type Listing = {
  id: string;
  type: CategoryKey;
  title: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  price_monthly: number | null;
  price_daily: number | null;
  price_slot: number | null;
  rating: number;
  review_count: number;
  images: string[];
  amenities: string[];
  is_verified: boolean;
};

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const [liked, setLiked] = useState(false);
  const cat = CATEGORIES[listing.type];
  const Icon = cat.icon;
  const price = listing.price_monthly ?? listing.price_daily ?? listing.price_slot;
  const unit = listing.price_monthly ? "/mo" : listing.price_daily ? "/day" : "/slot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl glass hover:border-saffron/40 transition-all"
    >
      <Link to="/listing/$id" params={{ id: listing.id }} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.images[0] ?? "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium glass-strong flex items-center gap-1.5">
              <Icon className="h-3 w-3" style={{ color: cat.color }} />
              {cat.label.slice(0, -1)}
            </span>
            {listing.is_verified && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-saffron/90 text-navy-deep flex items-center gap-1">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition"
            aria-label="Save"
          >
            <Heart className={`h-4 w-4 transition ${liked ? "fill-saffron text-saffron" : ""}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-1">{listing.title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
              <span className="font-medium">{listing.rating}</span>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{listing.city}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{listing.review_count} reviews</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {listing.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground">{a}</span>
            ))}
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-xl font-display font-semibold text-gradient-saffron">₹{price?.toLocaleString("en-IN")}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            <span className="text-xs text-saffron group-hover:translate-x-1 transition-transform">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}