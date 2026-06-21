import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Sparkles, MapPin, Shield, Zap, Users, Building2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ListingCard, type Listing } from "@/components/shared/ListingCard";
import { CATEGORIES, CATEGORY_KEYS } from "@/lib/categories";
import { fetchListings } from "@/lib/listings.functions";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";

const listingsQuery = queryOptions({
  queryKey: ["listings"],
  queryFn: () => fetchListings(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ApnaStay — Apna Ghar, Apni Choice" },
      { name: "description", content: "Find hostels, PGs, gyms, libraries, mess and cafes near your college. Compare, book, and live smarter." },
      { property: "og:title", content: "ApnaStay — Smart Campus Living for Indian Students" },
      { property: "og:description", content: "Discover and book hostels, PGs, gyms, libraries near your college." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listingsQuery),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<div className="h-96" />}>
        <Featured />
      </Suspense>
      <HowItWorks />
      <Stats />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-25" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-saffron mb-6">
          <Sparkles className="h-3.5 w-3.5" /> India's smartest campus living platform
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl sm:text-7xl font-semibold tracking-tight"
        >
          Apna Ghar, <br className="sm:hidden" />
          <span className="text-gradient-saffron">Apni Choice</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover, compare, and book hostels, PGs, gyms, libraries, and mess services near your college — all in one beautifully simple app.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-10 max-w-2xl mx-auto">
          <Link to="/dashboard" className="block">
            <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 hover:border-saffron/40 transition">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="h-5 w-5 text-saffron" />
                <span className="text-muted-foreground text-sm sm:text-base text-left">Search by college, city or area...</span>
              </div>
              <span className="bg-saffron text-navy-deep font-semibold px-5 py-2.5 rounded-xl text-sm">Explore</span>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_KEYS.map((k) => {
            const c = CATEGORIES[k]; const Icon = c.icon;
            return (
              <Link
                key={k}
                to="/dashboard"
                search={{ cat: k }}
                className="px-4 py-2 rounded-full glass text-sm flex items-center gap-2 hover:border-saffron/40 hover:bg-white/10 transition"
              >
                <Icon className="h-3.5 w-3.5" style={{ color: c.color }} /> {c.label}
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Featured() {
  const { data: listings } = useSuspenseQuery(listingsQuery);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold">Featured spaces</h2>
          <p className="text-muted-foreground mt-2">Verified, top-rated, and loved by students.</p>
        </div>
        <Link to="/dashboard" className="hidden sm:block text-sm text-saffron hover:underline">View all →</Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(listings as Listing[]).slice(0, 8).map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, title: "Search & discover", desc: "Browse hostels, PGs, gyms, libraries on a live map near your college." },
    { icon: Building2, title: "Compare & shortlist", desc: "Side-by-side comparison, real reviews, and verified vendor badges." },
    { icon: Zap, title: "Book in seconds", desc: "Instant booking, secure payments, and digital rent agreements." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-display font-semibold text-center">How it works</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-8">
            <div className="h-12 w-12 rounded-xl bg-saffron/15 flex items-center justify-center text-saffron mb-4">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">{s.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "50K+", l: "Students helped", icon: Users },
    { v: "120+", l: "Cities covered", icon: MapPin },
    { v: "8K+", l: "Verified vendors", icon: Shield },
    { v: "4.8★", l: "Average rating", icon: Sparkles },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="glass-strong rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <s.icon className="h-5 w-5 text-saffron mx-auto mb-2" />
            <div className="text-3xl font-display font-semibold text-gradient-saffron">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
