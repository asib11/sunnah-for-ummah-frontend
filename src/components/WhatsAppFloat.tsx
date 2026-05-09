"use client";

import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const phoneNumber = "8801830663523";
  const message = encodeURIComponent("Assalamu Alaikum! I have a question about your products.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-4 pr-2 py-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-sm font-body font-medium hidden sm:inline">Chat on WhatsApp</span>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
        <MessageCircle className="w-5 h-5 fill-white" />
      </div>
    </a>
  );
};

export default WhatsAppFloat;
