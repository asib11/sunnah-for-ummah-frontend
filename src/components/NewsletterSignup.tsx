"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // TODO: connect to backend newsletter endpoint when ready
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Subscribed! Welcome to the Sunnah for Ummah family.", {
        description: "You'll be the first to know about new drops and exclusive offers.",
      });
      setSubscribed(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-light to-primary px-6 py-12 md:px-16 md:py-16 shadow-xl">
        {/* Decorative accents */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.18),_transparent_60%)]" />

        <div className="relative max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 font-body text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent">
            <span className="h-px w-6 bg-accent/70" />
            Stay Connected
            <span className="h-px w-6 bg-accent/70" />
          </span>

          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            Join the <span className="italic text-accent">Sunnah</span> Circle
          </h2>

          <p className="mt-4 font-body text-sm md:text-base text-primary-foreground/85 leading-relaxed">
            Be the first to know about new Panjabi, Thobe and Attar drops, exclusive offers, and Sunnah-inspired stories — straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
            noValidate
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading || subscribed}
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
                maxLength={255}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-background text-foreground placeholder:text-muted-foreground font-body text-sm outline-none ring-2 ring-transparent focus:ring-accent transition disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || subscribed}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-body font-semibold text-sm tracking-wide hover:bg-accent/90 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Subscribing…
                </>
              ) : subscribed ? (
                <>
                  <Check className="w-4 h-4" /> Subscribed
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>

          {error && (
            <p
              id="newsletter-error"
              role="alert"
              className="mt-3 font-body text-xs text-destructive-foreground bg-destructive/90 inline-block px-3 py-1.5 rounded-full"
            >
              {error}
            </p>
          )}

          <p className="mt-6 font-body text-[11px] uppercase tracking-[0.3em] text-primary-foreground/70">
            SUNNAH: THE LEGACY OF THE BEST.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
