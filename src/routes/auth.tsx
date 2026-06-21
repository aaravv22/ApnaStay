import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — ApnaStay" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) {
          if (/already\s*registered|already\s*exists|user\s*already/i.test(error.message)) {
            toast.error("This email is already registered. Try signing in instead.");
            setMode("signin");
          } else {
            toast.error(error.message);
          }
          return;
        }
        // With email auto-confirm enabled, a session is returned immediately.
        if (data.session) {
          toast.success(`Welcome to ApnaStay, ${name || "friend"}! 🎉`);
          nav({ to: "/dashboard" });
        } else {
          toast.success("Account created! Please check your email to confirm.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/invalid\s*login|invalid\s*credentials/i.test(error.message)) {
            toast.error("Wrong email or password. Try again.");
          } else if (/not\s*confirmed|email.*confirm/i.test(error.message)) {
            toast.error("Please confirm your email first — check your inbox.");
          } else {
            toast.error(error.message);
          }
          return;
        }
        toast.success("Welcome back!");
        nav({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally { setLoading(false); }
  }

  async function google() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) {
        toast.error(result.error.message || "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      toast.success("Welcome!");
      nav({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in unavailable");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 mx-auto max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 rounded-xl bg-saffron/20 items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-saffron" />
            </div>
            <h1 className="text-2xl font-display font-semibold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
            <p className="text-muted-foreground text-sm mt-1">Find your perfect campus home</p>
          </div>

          <Button onClick={google} disabled={loading} variant="outline" className="w-full mb-4 bg-white/5 h-11">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.36-1.62 4-5.35 4-3.22 0-5.85-2.66-5.85-5.94S8.78 6.42 12 6.42c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.74 3.95 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.64-3.65 8.64-8.79 0-.6-.07-1.05-.16-1.51z"/></svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 my-4 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />}
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" minLength={6} required />
            <Button type="submit" disabled={loading} className="w-full bg-saffron hover:bg-saffron-glow text-navy-deep font-semibold h-11">
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            {mode === "signin" ? "New to ApnaStay?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-saffron hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}