import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/Navbar";
import { Building2, TrendingUp, Calendar } from "lucide-react";

export const Route = createFileRoute("/vendor")({
  head: () => ({ meta: [{ title: "Vendor Dashboard — ApnaStay" }] }),
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-4xl font-display font-semibold">List your space on ApnaStay</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Reach thousands of college students looking for your kind of space. Full vendor dashboard with analytics, bookings, and chat is coming in the next update.</p>
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Building2, t: "List unlimited spaces", d: "Hostels, PGs, gyms, libraries, mess, cafes" },
            { icon: Calendar, t: "Manage bookings", d: "Accept, reject, complete — all in one place" },
            { icon: TrendingUp, t: "Revenue analytics", d: "Track earnings, peak hours, and ratings" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-left">
              <div className="h-10 w-10 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center mb-3"><s.icon className="h-5 w-5" /></div>
              <div className="font-semibold">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});