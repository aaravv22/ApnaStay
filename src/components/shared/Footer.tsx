import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Twitter, Instagram, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-saffron to-saffron-glow flex items-center justify-center">
              <MapPin className="h-4 w-4 text-navy-deep" />
            </div>
            <span className="font-display text-lg font-semibold">Apna<span className="text-gradient-saffron">Stay</span></span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Smart campus living for college students across India.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Find hostels & PGs</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Gyms & libraries</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Mess & cafes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">For partners</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/vendor" className="hover:text-foreground">List your space</Link></li>
            <li><Link to="/vendor" className="hover:text-foreground">Vendor dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/10"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/10"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Github" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/10"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ApnaStay. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Made with <Heart className="h-3.5 w-3.5 fill-saffron text-saffron" /> in India</p>
        </div>
      </div>
    </footer>
  );
}