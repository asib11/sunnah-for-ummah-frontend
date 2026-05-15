
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2d5a42] text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="font-display text-2xl font-bold tracking-tight">Sunnah for Ummah</h3>
            <p className="text-sm text-white/70 leading-relaxed font-light max-w-xs">
              Bismillah in every step — clothing for the people of Tawakkul.
            </p>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Follow the Journey</h4>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-6 text-white/60">Quick Links</h4>
            <ul className="space-y-3">
              {["Shop", "New Arrivals", "Best Sellers", "About Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-6 text-white/60">Customer Service</h4>
            <ul className="space-y-3">
              {["Track Order", "Return Policy", "Shipping Info", "FAQs"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition-colors font-light">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-6 text-white/60">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 flex justify-center">
                  <Phone className="w-4 h-4 text-[#d9a34a]" />
                </div>
                <span className="text-sm text-white/70 font-light">+880 1830-663523</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-5 flex justify-center">
                  <Mail className="w-4 h-4 text-[#d9a34a]" />
                </div>
                <span className="text-sm text-white/70 font-light truncate">sunnahforummahshop@gmail.com</span>
                <button className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest ml-1 border border-white/10">
                  Copy
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 flex justify-center">
                  <MapPin className="w-4 h-4 text-[#d9a34a]" />
                </div>
                <span className="text-sm text-white/70 font-light">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium tracking-widest text-white/40 uppercase">
            © 2026 Sunnah for Ummah. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-medium tracking-widest text-white/40 hover:text-white/60 transition-colors uppercase">Privacy Policy</a>
            <a href="#" className="text-[10px] font-medium tracking-widest text-white/40 hover:text-white/60 transition-colors uppercase">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
