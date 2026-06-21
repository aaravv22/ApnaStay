import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => { sub.subscription.unsubscribe(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Explore" },
    { to: "/vendor", label: "List your space" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? "glass-strong" : ""}`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-saffron to-saffron-glow flex items-center justify-center glow-saffron">
              <MapPin className="h-5 w-5 text-navy-deep" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Apna<span className="text-gradient-saffron">Stay</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <Button asChild variant="default" size="sm" className="bg-saffron hover:bg-saffron-glow text-navy-deep font-semibold">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-saffron hover:bg-saffron-glow text-navy-deep font-semibold">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="flex flex-col p-4 gap-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">{l.label}</Link>
            ))}
            <Link to="/auth" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg bg-saffron text-navy-deep font-semibold text-center mt-2">
              {session ? "Dashboard" : "Get started"}
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}