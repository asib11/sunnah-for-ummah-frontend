"use client";

import { Phone, Mail, MapPin, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CONTACT_EMAIL = "sunnahforummahshop@gmail.com";

const brandTaglines = [
  "Reviving the Sunnah through modest, stylish clothing.",
  "Wear the legacy of the Prophet ﷺ — modesty is beauty.",
  "Threads woven with Iman. Style guided by the Sunnah.",
  "Modesty is not a limit — it is the crown of the believer.",
  "Dress for the One who sees the heart before the garment.",
  "Every stitch a sadaqah, every thread a remembrance of Allah.",
  "Bismillah in every step — clothing for the people of Tawakkul.",
  "Carry the Sunnah on your shoulders, Dawah in your walk.",
  "Hayaa is the garment of the believer — wear it with pride.",
  "From the streets to the sujood — modesty without compromise.",
];

const Footer = () => {
  const [taglineIdx, setTaglineIdx] = useState(() =>
    Math.floor(Math.random() * brandTaglines.length)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIdx((prev) => {
        if (brandTaglines.length <= 1) return prev;
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * brandTaglines.length);
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast.success("Email copied", { description: CONTACT_EMAIL });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  return (
    <footer id="about-us" className="bg-primary text-primary-foreground mt-12 md:mt-16 scroll-mt-28 pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-xl font-bold mb-3">Sunnah for Ummah</h3>
            <p
              key={taglineIdx}
              className="font-body text-sm text-primary-foreground/70 leading-relaxed min-h-[3.5rem] animate-fade-in"
            >
              {brandTaglines[taglineIdx]}
            </p>
            <div className="mt-5">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary-foreground/50 mb-2.5">
                Follow the journey
              </p>
              <div className="flex items-center gap-2.5">
                {[
                  {
                    label: "Facebook",
                    href: "https://www.facebook.com/profile.php?id=61578530170736",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Instagram",
                    href: "https://www.instagram.com/sunnahforummah",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    href: "https://www.youtube.com/@sunnahforummah",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                        <path d="M22.54 6.42A2.78 2.78 0 0 0 20.59 4.4C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2.02A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                      </svg>
                    ),
                  },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow Sunnah for Ummah on ${label}`}
                    className="group w-9 h-9 rounded-full border border-primary-foreground/25 bg-primary-foreground/5 flex items-center justify-center text-primary-foreground/80 hover:text-accent-foreground hover:bg-accent hover:border-accent transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_hsl(var(--accent)/0.6)]"
                  >
                    <span className="transition-transform group-hover:scale-110">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Shop", target: "shop" },
                { label: "New Arrivals", target: "new-arrivals" },
                { label: "Best Sellers", target: "best-sellers" },
                { label: "About Us", target: "about-us" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={`#${link.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(link.target)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      history.replaceState(null, "", `#${link.target}`);
                    }}
                    className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {[
                { label: "Track Order", target: "contact-us" },
                { label: "Return Policy", target: "contact-us" },
                { label: "Shipping Info", target: "contact-us" },
                { label: "FAQs", target: "contact-us" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={`#${link.target}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(link.target)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact-us" className="col-span-2 md:col-span-1 scroll-mt-28">
            <h4 className="font-body font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-foreground/70" />
                <span className="font-body text-sm text-primary-foreground/70">+880 1830-663523</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Mail className="w-4 h-4 text-primary-foreground/70 shrink-0" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors break-all"
                >
                  {CONTACT_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-primary-foreground/20 hover:border-accent hover:text-accent text-[10px] uppercase tracking-widest font-body font-semibold text-primary-foreground/70 transition-all hover:bg-primary-foreground/5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-foreground/70" />
                <span className="font-body text-sm text-primary-foreground/70">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center">
          <p className="font-body text-xs text-primary-foreground/50">
            © 2026 Sunnah for Ummah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


