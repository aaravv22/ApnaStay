import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export type ChatContext = {
  id: string;
  type: string;
  title: string;
  city: string;
  address?: string;
  price?: number | null;
  unit?: string;
  amenities?: string[];
};

export function openApnaChat(ctx?: ChatContext) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("apna:chat-open", { detail: ctx }));
}

export function AIChatBubble() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey! I'm your ApnaStay assistant ✨ Tell me your budget, college, and what you're looking for — I'll help you find it." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    function onOpen(e: Event) {
      const ctx = (e as CustomEvent<ChatContext | undefined>).detail;
      setOpen(true);
      if (ctx) {
        setContext(ctx);
        const price = ctx.price ? `₹${ctx.price.toLocaleString("en-IN")}${ctx.unit ?? ""}` : "price on request";
        const amen = ctx.amenities?.length ? ` Amenities: ${ctx.amenities.join(", ")}.` : "";
        setMessages([
          {
            role: "assistant",
            content: `You're asking about **${ctx.title}** (${ctx.type}) in ${ctx.city}${ctx.address ? ` — ${ctx.address}` : ""}. ${price}.${amen}\n\nAsk me anything about this place — safety, distance to campus, food, deposit, comparisons.`,
          },
        ]);
      }
    }
    window.addEventListener("apna:chat-open", onOpen as EventListener);
    return () => window.removeEventListener("apna:chat-open", onOpen as EventListener);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const payload = context
        ? [
            {
              role: "user" as const,
              content: `Context: I'm viewing listing "${context.title}" (${context.type}) in ${context.city}${context.address ? `, ${context.address}` : ""}. Price: ${context.price ? `₹${context.price}${context.unit ?? ""}` : "n/a"}. Amenities: ${(context.amenities ?? []).join(", ") || "none listed"}. Listing link: /listing/${context.id}. Answer my questions specifically about THIS listing.`,
            },
            ...next,
          ]
        : next;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      if (!res.ok || !res.body) {
        if (res.status === 429) toast.error("Rate limit reached — try again in a moment.");
        else if (res.status === 402) toast.error("AI credits exhausted. Add credits in Lovable Cloud.");
        else toast.error("Chat failed. Please try again.");
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-saffron to-saffron-glow text-navy-deep flex items-center justify-center glow-saffron"
        aria-label="AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] rounded-2xl glass-strong flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-saffron/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-saffron" />
              </div>
              <div>
                <div className="font-semibold text-sm">ApnaStay AI</div>
                <div className="text-xs text-muted-foreground">Your campus living guide</div>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-saffron text-navy-deep" : "bg-white/5 text-foreground"
                  }`}>{m.content || (loading && i === messages.length - 1 ? "…" : "")}</div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask me anything…"
                disabled={loading}
                className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-saffron/50"
              />
              <button onClick={send} disabled={loading || !input.trim()} className="h-10 w-10 rounded-xl bg-saffron text-navy-deep flex items-center justify-center disabled:opacity-40">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}