"use client";

import { MessageCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const WhatsAppFloat = () => {
  const phoneNumber = "8801830663523";
  const message = encodeURIComponent("Assalamu Alaikum! I have a question about your products.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  const { count } = useCart();

  // When the sticky cart bar is visible on mobile, lift WhatsApp higher so
  // their tap targets never overlap. Includes iOS safe-area insets.
  const mobileBottom = count > 0
    ? "calc(6.75rem + env(safe-area-inset-bottom))"
    : "calc(1.5rem + env(safe-area-inset-bottom))";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        bottom: mobileBottom,
        right: "calc(1rem + env(safe-area-inset-right))",
        touchAction: "manipulation",
      }}
      className="fixed md:!bottom-8 md:!right-6 z-40 flex items-center gap-2 pl-4 pr-2 py-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 transition-[bottom,transform,box-shadow] duration-300 group select-none"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-sm font-body font-medium hidden sm:inline">Chat on WhatsApp</span>
      <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <MessageCircle className="w-5 h-5 fill-white" />
      </div>
    </a>
  );
};

export default WhatsAppFloat;


